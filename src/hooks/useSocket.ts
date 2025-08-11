import { useEffect, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./useAuth";
import {
  SocketEvent,
  NewMessageEvent,
  MessageReadByEvent,
  UserJoinedEvent,
  UserLeftEvent,
  ParticipantApprovedEvent,
  SocketError,
} from "@/types/socket";

interface UseSocketOptions {
  chatRoomId?: string;
  onNewMessage?: (data: NewMessageEvent) => void;
  onMessageReadBy?: (data: MessageReadByEvent) => void;
  onUserJoined?: (data: UserJoinedEvent) => void;
  onUserLeft?: (data: UserLeftEvent) => void;
  onParticipantApproved?: (data: ParticipantApprovedEvent) => void;
  onError?: (error: SocketError) => void;
}

// 전역 소켓 인스턴스 (StrictMode에서도 단일 인스턴스 보장)
let globalSocket: Socket | null = null;
let globalPreviousRoomId: string | undefined = undefined;

export const useSocket = (options: UseSocketOptions = {}) => {
  const { user, isAuthenticated, accessToken } = useAuth();
  const {
    chatRoomId,
    onNewMessage,
    onMessageReadBy,
    onUserJoined,
    onUserLeft,
    onParticipantApproved,
    onError,
  } = options;

  // 콜백 함수들을 ref로 저장하여 재렌더링 시에도 참조 유지
  const callbacksRef = useRef({
    onNewMessage,
    onMessageReadBy,
    onUserJoined,
    onUserLeft,
    onParticipantApproved,
    onError,
  });

  // 콜백 업데이트
  useEffect(() => {
    callbacksRef.current = {
      onNewMessage,
      onMessageReadBy,
      onUserJoined,
      onUserLeft,
      onParticipantApproved,
      onError,
    };
  });

  // Socket 연결 초기화
  const initSocket = useCallback(() => {
    console.log("🔍 Socket 초기화 시도", {
      isAuthenticated,
      userId: user?.id,
      hasToken: !!accessToken,
    });

    if (!isAuthenticated || !user || !accessToken) {
      console.log("Socket 연결 실패: 인증되지 않은 사용자 또는 토큰 없음", {
        isAuthenticated,
        user,
        hasToken: !!accessToken,
      });
      return;
    }

    // 이미 소켓이 있으면 (연결 중이거나 연결됨) 재사용
    if (globalSocket) {
      console.log("Socket 인스턴스 존재 - 재사용", {
        connected: globalSocket.connected,
        connecting: globalSocket.connecting,
      });
      return globalSocket;
    }

    // Socket.io 서버 URL (환경변수에서 가져오기)
    const socketUrl =
      import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

    console.log("🔌 Socket 연결 시도:", {
      url: socketUrl,
      userId: user.id,
      tokenLength: accessToken?.length,
    });

    // Socket 연결 생성
    const socket = io(socketUrl, {
      auth: {
        token: accessToken, // Supabase JWT 토큰 전송
        userId: user.id,
      },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // 연결 이벤트
    socket.on(SocketEvent.CONNECT, () => {
      console.log("✅ Socket 연결 성공:", socket.id);
      // 여기서는 join 하지 않음 - useEffect에서 처리
    });

    // 채팅방 참가 성공 이벤트
    socket.on("joined-chat-room", ({ chatRoomId: roomId }) => {
      console.log(`✅ 채팅방 ${roomId}에 성공적으로 참가`);
    });

    // 채팅방 참가 실패 이벤트
    socket.on("join-chat-room-error", ({ error: joinError }) => {
      console.error("❌ 채팅방 참가 실패:", joinError);
      callbacksRef.current.onError?.({
        code: "JOIN_ERROR",
        message: joinError,
      });
    });

    // 연결 해제 이벤트
    socket.on(SocketEvent.DISCONNECT, (reason) => {
      console.log("🔌 Socket 연결 해제:", reason);
    });

    // 에러 이벤트
    socket.on(SocketEvent.ERROR, (error: SocketError) => {
      console.error("❌ Socket 에러:", error);
      callbacksRef.current.onError?.(error);
    });

    globalSocket = socket;
    return socket;
  }, [isAuthenticated, user, accessToken, chatRoomId]);

  // 채팅방 참가
  const joinRoom = useCallback((roomId: string) => {
    if (globalSocket?.connected) {
      // 서버가 기대하는 이벤트명 사용 (문자열로 전송)
      globalSocket.emit("join-chat-room", roomId);
      console.log(`📌 채팅방 ${roomId}에 참가 요청`);
    } else {
      console.warn("⚠️ Socket이 연결되지 않음. 채팅방 참가 불가");
    }
  }, []);

  // 채팅방 나가기
  const leaveRoom = useCallback((roomId: string) => {
    if (globalSocket?.connected) {
      // 서버가 기대하는 이벤트명 사용 (문자열로 전송)
      globalSocket.emit("leave-chat-room", roomId);
      console.log(`👋 채팅방 ${roomId}에서 나가기 요청`);
    }
  }, []);

  // 이벤트 리스너 설정 및 채팅방 관리
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const socket = initSocket();
    if (!socket) return;

    // 채팅방 전환 처리 - chatRoomId가 있고 이전과 다를 때만
    if (chatRoomId && globalPreviousRoomId !== chatRoomId) {
      // 이전 채팅방에서 나가기
      if (globalPreviousRoomId) {
        socket.emit("leave-chat-room", globalPreviousRoomId);
        console.log(`👋 이전 채팅방 ${globalPreviousRoomId}에서 나가기`);
      }

      // globalPreviousRoomId를 먼저 업데이트하여 중복 방지
      globalPreviousRoomId = chatRoomId;

      // 새 채팅방에 참가 (socket이 연결되어 있을 때만)
      if (socket.connected) {
        socket.emit("join-chat-room", chatRoomId);
        console.log(`📌 채팅방 ${chatRoomId}에 참가 (useEffect)`);
      } else {
        // 연결되지 않았으면 연결 후 참가
        socket.once(SocketEvent.CONNECT, () => {
          // 연결 시점에 다시 확인
          if (globalPreviousRoomId === chatRoomId) {
            socket.emit("join-chat-room", chatRoomId);
            console.log(`📌 채팅방 ${chatRoomId}에 참가 (연결 후)`);
          }
        });
      }
    }

    // 디버깅: 모든 이벤트 로깅 (이미 오버라이드 되어있지 않은 경우만)
    if (!socket.emit.toString().includes("Emitting event")) {
      const originalEmit = socket.emit;
      socket.emit = function (...args: any[]) {
        console.log("📤 Emitting event:", args[0], args[1]);
        return originalEmit.apply(socket, args as any);
      };
    }

    // 디버깅: 받는 모든 이벤트 확인
    socket.onAny((eventName, ...args) => {
      console.log("📥 Received event:", eventName, args);
    });

    // 새 메시지 이벤트 (서버가 보내는 정확한 이벤트명 사용)
    const handleNewMessage = (data: any) => {
      console.log("🔵 new-message 이벤트 수신:", data);

      // 서버 페이로드를 클라이언트 형식으로 변환
      const messageEvent: NewMessageEvent = {
        id: data.id,
        content: data.content,
        messageType: data.messageType || data.message_type,
        sender: data.sender,
        timestamp: data.timestamp || data.created_at,
        chatRoomId: data.chatRoomId || chatRoomId || "",
      };

      callbacksRef.current.onNewMessage?.(messageEvent);
    };

    socket.on(SocketEvent.NEW_MESSAGE, handleNewMessage);

    // 메시지 읽음 이벤트
    const handleMessageReadBy = (data: any) => {
      console.log("🔵 message-read-by 이벤트 수신:", data);
      callbacksRef.current.onMessageReadBy?.(data as MessageReadByEvent);
    };

    socket.on(SocketEvent.MESSAGE_READ_BY, handleMessageReadBy);

    // 사용자 입장 이벤트
    const handleUserJoined = (data: any) => {
      console.log("🔵 user-joined 이벤트 수신:", data);
      callbacksRef.current.onUserJoined?.(data as UserJoinedEvent);
    };

    socket.on(SocketEvent.USER_JOINED, handleUserJoined);

    // 사용자 퇴장 이벤트
    const handleUserLeft = (data: any) => {
      console.log("🔵 user-left 이벤트 수신:", data);
      callbacksRef.current.onUserLeft?.(data as UserLeftEvent);
    };

    socket.on(SocketEvent.USER_LEFT, handleUserLeft);

    // 참가자 승인 이벤트
    const handleParticipantApproved = (data: any) => {
      console.log("🔵 participant-approved 이벤트 수신:", data);
      callbacksRef.current.onParticipantApproved?.(
        data as ParticipantApprovedEvent
      );
    };

    socket.on(SocketEvent.PARTICIPANT_APPROVED, handleParticipantApproved);

    // Cleanup
    return () => {
      // globalSocket이 현재 socket과 같을 때만 정리
      if (globalSocket === socket) {
        // 실제로 리스너가 있을 때만 로그 출력
        const hasListeners = socket.listeners(SocketEvent.NEW_MESSAGE).length > 0;
        if (hasListeners) {
          console.log("🧹 Socket cleanup - removing listeners");
        }

        // 이벤트 리스너 제거만 수행 (leave는 채팅방 전환 시 처리됨)
        socket.off(SocketEvent.NEW_MESSAGE, handleNewMessage);
        socket.off(SocketEvent.MESSAGE_READ_BY, handleMessageReadBy);
        socket.off(SocketEvent.USER_JOINED, handleUserJoined);
        socket.off(SocketEvent.USER_LEFT, handleUserLeft);
        socket.off(SocketEvent.PARTICIPANT_APPROVED, handleParticipantApproved);

        socket.offAny();
      }
    };
  }, [isAuthenticated, user, chatRoomId, initSocket]);

  // Socket 연결 해제
  const disconnect = useCallback(() => {
    if (globalSocket) {
      globalSocket.disconnect();
      globalSocket = null;
      globalPreviousRoomId = undefined;
      console.log("Socket 연결 해제됨");
    }
  }, []);

  return {
    socket: globalSocket,
    isConnected: globalSocket?.connected || false,
    joinRoom,
    leaveRoom,
    disconnect,
  };
};
