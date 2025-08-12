import { useDidMount } from "@/lib/react/useDidMount";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  MdArrowBack,
  MdGroup,
  MdInfo,
  MdMoreVert,
  MdSend,
  MdCheckCircle,
} from "react-icons/md";
import { useNavigate, useParams, useSearchParams, useLocation } from "react-router-dom";
import { useAuth, useMe } from "../hooks";
import {
  chatQueryKeys,
  useChatAllMessages,
  useChatRoom,
  useMarkChatRoomAsRead,
  useSendMessage,
  useApproveParticipant,
  useCancelParticipantApproval,
} from "../hooks/useChat";
import { useSocket } from "../hooks/useSocket";
import { getThemeClasses } from "../lib/theme";
import {
  MessageReadByEvent,
  NewMessageEvent,
  ParticipantApprovedEvent,
  UserJoinedEvent,
  UserLeftEvent,
} from "../types/socket";

// 내부 채팅 메시지 타입
interface ChatMessage {
  id: string;
  content: string;
  messageType: "text" | "image" | "system";
  sender: {
    id: string;
    nickname: string;
    profile_image?: string;
  } | null;
  timestamp: string;
  chatRoomId: string;
  isOwn?: boolean;
  isRead?: boolean;
  fromApi?: boolean; // API에서 온 메시지인지 구분
  metadata?: {
    type?: string; // 'approval_request', 'approval_confirm' 등
    participantId?: string;
    participantName?: string;
  };
}

const ChatRoomPage = () => {
  const queryClient = useQueryClient();
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const theme = getThemeClasses();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [pendingApprovalParticipantId, setPendingApprovalParticipantId] =
    useState<string | null>(null);
  const [isPendingJoin, setIsPendingJoin] = useState(false);
  const [pendingMatchId, setPendingMatchId] = useState<string | null>(null);

  // 메시지 병합 관리를 위한 내부 Map (id -> message)
  const messagesMapRef = useRef<Map<string, ChatMessage>>(new Map());

  // 시간 파싱 유틸
  const toTime = (ts?: string) => {
    const t = ts ? new Date(ts).getTime() : NaN;
    return Number.isNaN(t) ? 0 : t;
  };

  // 사용자 정보 가져오기
  const { user } = useAuth();

  // 채팅방 정보 조회
  const { data: roomData } = useChatRoom(roomId || "");
  const chatRoom = roomData?.data;

  // 메시지 데이터 조회
  const { data: messagesData, isLoading: isMessagesLoading } =
    useChatAllMessages(roomId || "", { enabled: !!roomId });

  const sendMessageMutation = useSendMessage();
  const markAsReadMutation = useMarkChatRoomAsRead();
  const approveParticipantMutation = useApproveParticipant();
  const cancelParticipantApprovalMutation = useCancelParticipantApproval();

  // API 메시지를 내부 포맷으로 변환
  const normalizeApiMessage = useCallback(
    (msg: any): ChatMessage => ({
      id: msg.id,
      content: msg.content ?? "",
      messageType: (msg.message_type as "text" | "image" | "system") || "text",
      metadata:
        msg.metadata ||
        (msg.content &&
        typeof msg.content === "string" &&
        msg.content.startsWith("{")
          ? (() => {
              try {
                return JSON.parse(msg.content);
              } catch {
                return undefined;
              }
            })()
          : undefined),
      sender: msg.sender
        ? {
            id: msg.sender.id || "",
            nickname: msg.sender.nickname || "",
            profile_image: msg.sender.profile_image_url,
          }
        : null,
      timestamp: msg.created_at || new Date().toISOString(),
      chatRoomId: roomId || "",
      isOwn: (msg.sender?.id ?? undefined) === user?.id,
      fromApi: true,
      // isRead는 소켓 이벤트로 동기화
    }),
    [roomId, user?.id]
  );

  // 메시지 업서트 + 정렬 반영
  const upsertMessages = useCallback(
    (incoming: ChatMessage | ChatMessage[]) => {
      const arr = Array.isArray(incoming) ? incoming : [incoming];

      const map = messagesMapRef.current;
      let changed = false;

      for (const m of arr) {
        const prev = map.get(m.id);
        if (!prev) {
          map.set(m.id, m);
          changed = true;
        } else {
          const merged: ChatMessage = {
            ...prev,
            ...m,
            // 기존 읽음 상태 유지 우선
            isRead: prev.isRead || m.isRead,
            // sender 정보는 더 풍부한 쪽 우선
            sender: m.sender ?? prev.sender,
            // 소유자 여부는 sender 기준으로 재계산
            isOwn: (m.sender?.id ?? prev.sender?.id) === user?.id,
            // 출처 정보는 둘 중 하나라도 API면 true 유지
            fromApi: prev.fromApi || m.fromApi,
          };
          // 변경 사항이 있을 때만 갱신
          if (
            prev.content !== merged.content ||
            prev.timestamp !== merged.timestamp ||
            prev.isRead !== merged.isRead ||
            prev.isOwn !== merged.isOwn ||
            prev.messageType !== merged.messageType ||
            prev.sender?.id !== merged.sender?.id ||
            prev.sender?.nickname !== merged.sender?.nickname ||
            prev.sender?.profile_image !== merged.sender?.profile_image ||
            prev.fromApi !== merged.fromApi
          ) {
            map.set(m.id, merged);
            changed = true;
          }
        }
      }

      if (changed) {
        const sorted = Array.from(map.values()).sort(
          (a, b) => toTime(a.timestamp) - toTime(b.timestamp)
        );
        setMessages(sorted);
      }
    },
    [user?.id, toTime]
  );

  // 마지막으로 읽음 처리한 메시지 추적
  const lastReadMessageIdRef = useRef<string | null>(null);

  // 읽음 상태 추적
  const [, setReadStatus] = useState<Map<string, string[]>>(new Map());

  // API 메시지 초기화 및 Socket 메시지와 병합
  useEffect(() => {
    if (!messagesData?.data) return;

    const apiMessages = messagesData.data.map(normalizeApiMessage);

    upsertMessages(apiMessages);
  }, [messagesData, normalizeApiMessage, upsertMessages]);

  // Socket 이벤트 핸들러
  const handleNewMessage = useCallback(
    (data: NewMessageEvent) => {
      console.log("새 메시지 수신:", data);

      const newMsg: ChatMessage = {
        id: data.id,
        content: data.content,
        messageType: data.messageType,
        // metadata 처리 추가 (API 메시지와 동일한 로직)
        metadata:
          data.content &&
          typeof data.content === "string" &&
          data.content.startsWith("{")
            ? (() => {
                try {
                  return JSON.parse(data.content);
                } catch {
                  return undefined;
                }
              })()
            : undefined,
        sender: data.sender,
        timestamp: data.timestamp,
        chatRoomId: data.chatRoomId,
        isOwn: data.sender?.id === user?.id,
        fromApi: false,
      };

      upsertMessages(newMsg);
    },
    [user?.id, upsertMessages]
  );

  const handleMessageReadBy = useCallback((data: MessageReadByEvent) => {
    console.log("메시지 읽음 처리:", data);

    // 읽음 상태 업데이트 (누가 읽었는지 추적)
    setReadStatus((prev) => {
      const newStatus = new Map(prev);
      const readers = newStatus.get(data.messageId) || [];
      if (!readers.includes(data.userId)) {
        readers.push(data.userId);
        newStatus.set(data.messageId, readers);
      }
      return newStatus;
    });

    // 메시지 읽음 상태 반영 (내 메시지의 읽음 표시 등에 사용)
    const map = messagesMapRef.current;
    const target = map.get(data.messageId);
    if (target && !target.isRead) {
      map.set(data.messageId, { ...target, isRead: true });
      const sorted = Array.from(map.values()).sort(
        (a, b) => toTime(a.timestamp) - toTime(b.timestamp)
      );
      setMessages(sorted);
    }
  }, []);

  const handleUserJoined = useCallback(
    (data: UserJoinedEvent) => {
      // console.log("사용자 입장:", data);
      // // 시스템 메시지 추가
      // const joinMessage: ChatMessage = {
      //   id: `system-join-${Date.now()}`,
      //   content: `${data.nickname}님이 입장했습니다.`,
      //   messageType: "system",
      //   sender: null,
      //   timestamp: data.timestamp,
      //   chatRoomId: roomId || "",
      // };
      // upsertMessages(joinMessage);
    },
    [roomId, upsertMessages]
  );

  const handleUserLeft = useCallback(
    (data: UserLeftEvent) => {
      // console.log("사용자 퇴장:", data);
      // // 시스템 메시지 추가
      // const leftMessage: ChatMessage = {
      //   id: `system-left-${Date.now()}`,
      //   content: `${data.nickname}님이 퇴장했습니다.`,
      //   messageType: "system",
      //   sender: null,
      //   timestamp: data.timestamp,
      //   chatRoomId: roomId || "",
      // };
      // upsertMessages(leftMessage);
    },
    [roomId, upsertMessages]
  );

  const handleParticipantApproved = useCallback(
    (data: ParticipantApprovedEvent) => {
      console.log("참가자 승인:", data);

      // 시스템 메시지 추가
      const approvalMessage: ChatMessage = {
        id: `system-approved-${Date.now()}`,
        content: `${data.participantName}님의 참가가 승인되었습니다! 🎾`,
        messageType: "system",
        sender: null,
        timestamp: new Date().toISOString(),
        chatRoomId: roomId || "",
      };

      upsertMessages(approvalMessage);
    },
    [roomId, upsertMessages]
  );

  // WebSocket 연결
  const { isConnected } = useSocket({
    chatRoomId: roomId,
    onNewMessage: handleNewMessage,
    onMessageReadBy: handleMessageReadBy,
    onUserJoined: handleUserJoined,
    onUserLeft: handleUserLeft,
    onParticipantApproved: handleParticipantApproved,
    onError: (error) => {
      console.error("Socket 에러:", error);
    },
  });

  useDidMount(() => {
    if (!roomId) {
      console.error("채팅방 ID가 없습니다. 페이지를 종료합니다.");
      return;
    }
    // joinRoom 호출 제거 - useSocket 훅에서 자동으로 처리됨
    console.log("채팅방 페이지 마운트 - roomId:", roomId);
  });

  // 컴포넌트 언마운트 시 채팅방 나가기 - useSocket에서 자동 처리되므로 제거
  // leaveRoom 호출 제거 - useSocket 훅의 cleanup에서 처리됨

  // roomId 바뀌거나 pending 상태 확인
  useEffect(() => {
    setMessages([]); // 메시지 초기화
    lastReadMessageIdRef.current = null;
    messagesMapRef.current = new Map(); // 내부 맵 초기화
    
    // URL 파라미터에서 pending 상태 확인
    const isPending = searchParams.get('pending') === 'true';
    const matchId = searchParams.get('matchId');
    
    if (isPending && matchId) {
      setIsPendingJoin(true);
      setPendingMatchId(matchId);
    } else {
      setIsPendingJoin(false);
      setPendingMatchId(null);
    }
  }, [roomId, searchParams]);

  // 메시지가 변경될 때마다 읽음 처리 (중복/루프 방지)
  useEffect(() => {
    if (!roomId || messages.length === 0) return;

    // 본인 메시지 아님 + system 아님 + sender 존재하는 마지막 수신 메시지
    const lastIncoming = [...messages]
      .reverse()
      .find((m) => !m.isOwn && m.messageType !== "system" && m.sender?.id);

    if (!lastIncoming) return;

    // 이미 처리했거나, 진행 중이면 스킵
    if (
      lastReadMessageIdRef.current === lastIncoming.id ||
      markAsReadMutation.isPending
    ) {
      return;
    }

    // 루프 방지를 위해 먼저 기록
    lastReadMessageIdRef.current = lastIncoming.id;

    markAsReadMutation.mutate({
      roomId,
      body: { messageId: lastIncoming.id },
    });
  }, [roomId, messages, markAsReadMutation]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSendMessage = useCallback(async () => {
    if (!newMessage.trim() || !roomId || isSending) return;

    setIsSending(true);
    const messageContent = newMessage.trim();

    try {
      await sendMessageMutation.mutateAsync({
        roomId,
        content: messageContent,
        messageType: "text",
      });

      setNewMessage("");
    } catch (error) {
      console.error("메시지 전송 실패:", error);
    } finally {
      setIsSending(false);
    }
  }, [newMessage, roomId, isSending, sendMessageMutation]);

  // 확정 요청 버튼 클릭 핸들러
  const handleRequestApproval = useCallback(async () => {
    if (!roomId || isSending || !user) return;

    setIsSending(true);
    try {
      // 확정 요청 메시지 전송
      await sendMessageMutation.mutateAsync({
        roomId,
        content: JSON.stringify({
          type: "approval_request",
          participantId: user.id,
          participantName: "참가자",
        }),
        messageType: "system",
      });
    } catch (error) {
      console.error("확정 요청 실패:", error);
    } finally {
      setIsSending(false);
    }
  }, [roomId, isSending, sendMessageMutation, user]);

  // 호스트의 확정하기 버튼 클릭 핸들러 (채팅방 기반)
  const handleApproveParticipant = useCallback(async () => {
    if (!roomId) return;

    try {
      // 채팅방 ID만 전송 (상대방은 서버에서 자동 판별)
      await approveParticipantMutation.mutateAsync({
        roomId,
      });
      setPendingApprovalParticipantId(null);
    } catch (error) {
      console.error("참가자 승인 실패:", error);
    }
  }, [roomId, approveParticipantMutation]);

  // 호스트의 확정 취소 버튼 클릭 핸들러 (채팅방 기반)
  const handleCancelParticipantApproval = useCallback(async () => {
    if (!roomId || !user) return;

    try {
      // 확정 취소 API 호출 (채팅방 ID만 전송)
      await cancelParticipantApprovalMutation.mutateAsync({
        roomId,
      });
    } catch (error) {
      console.error("참가자 승인 취소 실패:", error);
    }
  }, [roomId, user, cancelParticipantApprovalMutation]);

  const handleMatchInfoClick = () => {
    if (chatRoom?.match?.id) {
      navigate(`/matching/${chatRoom.match.id}`);
    }
  };

  const getRoomName = () => {
    if (!chatRoom) return "";
    if (chatRoom.name) return chatRoom.name;
    if (chatRoom.type === "match" && chatRoom.match) {
      return `🎾 ${chatRoom.match.title}`;
    }
    if (chatRoom.type === "private" && chatRoom.otherParticipant) {
      return chatRoom.otherParticipant.nickname || "알 수 없는 사용자";
    }
    return "채팅방";
  };

  const getParticipantsCount = () => {
    return chatRoom?.participants?.length || 0;
  };

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey && !isSending) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage, isSending]
  );

  // 마지막 시스템 메시지의 상태를 확인하는 함수
  const getLastApprovalStatus = useCallback(() => {
    // 시스템 메시지 중에서 승인 관련 메시지들만 필터링하고 마지막 것 찾기
    const approvalMessages = messages
      .filter(
        (msg) =>
          msg.messageType === "system" &&
          msg.metadata?.type &&
          ["approval_request", "approval_confirm", "approval_cancel"].includes(
            msg.metadata.type
          )
      )
      .sort((a, b) => toTime(a.timestamp) - toTime(b.timestamp));

    const lastApprovalMessage = approvalMessages[approvalMessages.length - 1];
    return lastApprovalMessage?.metadata?.type || null;
  }, [messages, toTime]);

  // 확정 완료 메시지가 있는지 확인하는 함수 (기존 호환성을 위해 유지)
  const hasApprovalConfirm = useCallback(() => {
    const lastStatus = getLastApprovalStatus();
    return lastStatus === "approval_confirm";
  }, [getLastApprovalStatus]);

  return (
    <motion.div
      className={`h-screen flex flex-col ${theme.background.primary}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ paddingBottom: "calc(5rem + env(safe-area-inset-bottom))" }}
    >
      {/* Header */}
      <div
        className={`${theme.surface.card} border-b ${theme.border.primary} px-4 py-3 flex items-center gap-3`}
      >
        <motion.button
          className={`p-2 rounded-lg ${theme.text.primary}`}
          onClick={() => {
            queryClient.invalidateQueries({
              queryKey: chatQueryKeys.messages(roomId ?? ""),
            });
            navigate(-1);
          }}
          whileTap={{ scale: 0.95 }}
        >
          <MdArrowBack className="w-6 h-6" />
        </motion.button>

        <div className="flex-1">
          <h1 className={`font-semibold ${theme.text.primary}`}>
            {getRoomName()}
          </h1>
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1">
              <MdGroup className={`w-4 h-4 ${theme.text.secondary}`} />
              <span className={theme.text.secondary}>
                {getParticipantsCount()}명
              </span>
            </div>
            {!isConnected && (
              <span className="text-yellow-500 text-xs">연결 중...</span>
            )}
            {isConnected && <span className="text-green-500 text-xs">●</span>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* 매치 채팅방에서만 확정 요청/취소 버튼 표시 */}
          {chatRoom?.type === "private" && chatRoom?.match && (
            <>
              {(() => {
                const lastStatus = getLastApprovalStatus();

                // 호스트가 아닌 경우: 확정 요청 버튼
                if (chatRoom?.host?.id !== user?.id) {
                  const isConfirmed = lastStatus === "approval_confirm";
                  const isCanceled = lastStatus === "approval_cancel";
                  const hasRequest = lastStatus === "approval_request";

                  // 취소된 경우 다시 확정 요청 가능
                  const canRequest = !hasRequest && !isConfirmed;

                  return (
                    <motion.button
                      className={`px-3 py-1.5 text-sm rounded-lg font-medium flex items-center gap-1.5 ${
                        isConfirmed || (hasRequest && !isCanceled) || isSending
                          ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                          : "bg-tennis-ball-500 text-white"
                      }`}
                      onClick={handleRequestApproval}
                      whileTap={
                        isConfirmed || (hasRequest && !isCanceled) || isSending
                          ? undefined
                          : { scale: 0.95 }
                      }
                      disabled={
                        isConfirmed || (hasRequest && !isCanceled) || isSending
                      }
                    >
                      <MdCheckCircle className="w-4 h-4" />
                      {isConfirmed ? "확정 완료" : "확정 요청"}
                    </motion.button>
                  );
                }

                // 호스트인 경우
                if (chatRoom?.host?.id === user?.id) {
                  // 확정 완료 상태에서는 확정 취소 버튼 표시
                  if (lastStatus === "approval_confirm") {
                    return (
                      <motion.button
                        className={`px-3 py-1.5 text-sm rounded-lg font-medium flex items-center gap-1.5 ${
                          cancelParticipantApprovalMutation.isPending
                            ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                            : "bg-red-500 text-white hover:bg-red-600"
                        }`}
                        onClick={handleCancelParticipantApproval}
                        whileTap={
                          cancelParticipantApprovalMutation.isPending
                            ? undefined
                            : { scale: 0.95 }
                        }
                        disabled={cancelParticipantApprovalMutation.isPending}
                      >
                        <MdCheckCircle className="w-4 h-4" />
                        {cancelParticipantApprovalMutation.isPending
                          ? "취소 중..."
                          : "확정 취소"}
                      </motion.button>
                    );
                  }

                  // 취소된 상태이거나 아무 요청이 없는 상태에서는 확정 요청 버튼 표시
                  if (lastStatus === "approval_cancel" || lastStatus === null) {
                    return (
                      <motion.button
                        className={`px-3 py-1.5 text-sm rounded-lg font-medium flex items-center gap-1.5 ${
                          isSending
                            ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                            : "bg-tennis-ball-500 text-white"
                        }`}
                        onClick={handleRequestApproval}
                        whileTap={isSending ? undefined : { scale: 0.95 }}
                        disabled={isSending}
                      >
                        <MdCheckCircle className="w-4 h-4" />
                        확정 요청
                      </motion.button>
                    );
                  }
                }

                return null;
              })()}
            </>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* 참가 신청 처리 중 스켈레톤 */}
        {isPendingJoin && (
          <div className="space-y-4">
            {/* 참가 신청 처리 중 메시지 */}
            <div className="flex justify-center py-8">
              <div className="text-center space-y-3">
                <motion.div
                  className="w-16 h-16 mx-auto rounded-full bg-tennis-ball-100 dark:bg-tennis-ball-900/30 flex items-center justify-center"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <MdSend className="w-8 h-8 text-tennis-ball-600 dark:text-tennis-ball-400" />
                </motion.div>
                <div>
                  <p className={`text-lg font-semibold ${theme.text.primary}`}>
                    참가 신청 처리 중...
                  </p>
                  <p className={`text-sm ${theme.text.secondary} mt-1`}>
                    호스트와 채팅방을 준비하고 있습니다
                  </p>
                </div>
              </div>
            </div>
            
            {/* 스켈레톤 메시지들 */}
            <div className="space-y-4 opacity-30">
              {/* 받은 메시지 스켈레톤 */}
              <div className="flex justify-start">
                <div className="max-w-xs space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                  </div>
                  <div className="px-4 py-3 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-40 mb-2"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
                  </div>
                </div>
              </div>

              {/* 보낸 메시지 스켈레톤 */}
              <div className="flex justify-end">
                <div className="max-w-xs space-y-2">
                  <div className="px-4 py-3 bg-tennis-ball-200 dark:bg-tennis-ball-800 rounded-2xl animate-pulse">
                    <div className="h-4 bg-tennis-ball-300 dark:bg-tennis-ball-700 rounded w-36 mb-2"></div>
                    <div className="h-4 bg-tennis-ball-300 dark:bg-tennis-ball-700 rounded w-28"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* 일반 로딩 스켈레톤 */}
        {!isPendingJoin && isMessagesLoading && (
          <div className="space-y-4">
            {/* 받은 메시지 스켈레톤 */}
            <div className="flex justify-start">
              <div className="max-w-xs space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                </div>
                <div className="px-4 py-3 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-40 mb-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
                </div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12 ml-3 animate-pulse"></div>
              </div>
            </div>

            {/* 보낸 메시지 스켈레톤 */}
            <div className="flex justify-end">
              <div className="max-w-xs space-y-2">
                <div className="px-4 py-3 bg-tennis-ball-200 dark:bg-tennis-ball-800 rounded-2xl animate-pulse">
                  <div className="h-4 bg-tennis-ball-300 dark:bg-tennis-ball-700 rounded w-36 mb-2"></div>
                  <div className="h-4 bg-tennis-ball-300 dark:bg-tennis-ball-700 rounded w-28"></div>
                </div>
                <div className="flex justify-end items-center gap-2 mr-3">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12 animate-pulse"></div>
                  <div className="h-3 bg-tennis-ball-200 dark:bg-tennis-ball-700 rounded w-8 animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* 시스템 메시지 스켈레톤 */}
            <div className="flex justify-center">
              <div className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse">
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
              </div>
            </div>

            {/* 확정 요청 카드 스켈레톤 */}
            <div className="flex justify-center">
              <div className="max-w-sm w-full p-4 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 animate-pulse">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
                </div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded-lg w-full"></div>
              </div>
            </div>

            {/* 추가 메시지 스켈레톤들 */}
            <div className="flex justify-start">
              <div className="max-w-xs">
                <div className="px-4 py-3 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-48"></div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <div className="max-w-xs">
                <div className="px-4 py-3 bg-tennis-ball-200 dark:bg-tennis-ball-800 rounded-2xl animate-pulse">
                  <div className="h-4 bg-tennis-ball-300 dark:bg-tennis-ball-700 rounded w-32"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!isMessagesLoading && !isPendingJoin && (
          <AnimatePresence>
          {React.Children.toArray(
            messages.map((message) => (
              <motion.div
                className={`flex ${
                  message.isOwn ? "justify-end" : "justify-start"
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                // transition={{ delay: index * 0.05 }}
              >
                {message.messageType === "system" && (
                  <div className="w-full flex justify-center">
                    {message.metadata?.type === "approval_request" ? (
                      // 확정 요청 카드 메시지
                      <motion.div
                        className={`max-w-sm w-full p-4 rounded-xl ${theme.surface.card} border ${theme.border.primary} shadow-sm`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <MdCheckCircle className="w-5 h-5 text-tennis-ball-500" />
                            <span
                              className={`font-medium ${theme.text.primary}`}
                            >
                              참가 확정 요청
                            </span>
                          </div>
                        </div>
                        <p className={`text-sm mb-3 ${theme.text.secondary}`}>
                          {message.metadata.participantName}님이 참가 확정을
                          요청했습니다.
                        </p>
                        {/* 호스트만 확정하기 버튼 표시 */}
                        {chatRoom?.host?.id === user?.id &&
                          (() => {
                            const lastStatus = getLastApprovalStatus();
                            const isConfirmed =
                              lastStatus === "approval_confirm";
                            const isCanceled = lastStatus === "approval_cancel";

                            // 취소된 후에는 이전 확정 요청 카드의 버튼 비활성화
                            const isDisabled =
                              isConfirmed ||
                              isCanceled ||
                              approveParticipantMutation.isPending;

                            return (
                              <motion.button
                                className={`w-full py-2 rounded-lg font-medium ${
                                  isDisabled
                                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                                    : "bg-tennis-ball-500 text-white"
                                }`}
                                onClick={handleApproveParticipant}
                                whileTap={
                                  isDisabled ? undefined : { scale: 0.98 }
                                }
                                disabled={isDisabled}
                              >
                                {isConfirmed
                                  ? "이미 확정됨"
                                  : isCanceled
                                  ? "취소됨"
                                  : approveParticipantMutation.isPending
                                  ? "처리 중..."
                                  : "확정하기"}
                              </motion.button>
                            );
                          })()}
                        {chatRoom?.host?.id !== user?.id && (
                          <div
                            className={`text-center text-sm ${theme.text.secondary}`}
                          >
                            호스트의 승인을 기다리는 중입니다...
                          </div>
                        )}
                      </motion.div>
                    ) : message.metadata?.type === "approval_confirm" ? (
                      // 확정 완료 카드 메시지
                      <motion.div
                        className={`max-w-sm w-full p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 shadow-sm`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <MdCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                            <span className="font-medium text-green-800 dark:text-green-200">
                              참가 확정 완료!
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          {message.metadata.participantName}님의 참가가
                          확정되었습니다.
                        </p>
                      </motion.div>
                    ) : message.metadata?.type === "approval_cancel" ? (
                      // 확정 취소 카드 메시지
                      <motion.div
                        className={`max-w-sm w-full p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 shadow-sm`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <MdCheckCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                          <span className="font-medium text-red-800 dark:text-red-200">
                            참가 확정 취소
                          </span>
                        </div>
                        <p className="text-sm text-red-700 dark:text-red-300">
                          {message.metadata.participantName}님의 참가 확정이
                          취소되었습니다.
                        </p>
                      </motion.div>
                    ) : (
                      // 일반 시스템 메시지
                      <div
                        className={`text-xs px-3 py-1 rounded-full ${theme.surface.card} ${theme.text.secondary}`}
                      >
                        {message.content}
                      </div>
                    )}
                  </div>
                )}

                {message.messageType === "text" && (
                  <div
                    className={`max-w-xs ${
                      message.isOwn ? "items-end" : "items-start"
                    } flex flex-col`}
                  >
                    {!message.isOwn && message.sender && (
                      <div
                        className={`text-xs mb-1 ml-3 ${theme.text.secondary}`}
                      >
                        {message.sender.nickname}
                      </div>
                    )}
                    <div
                      className={`px-4 py-2 rounded-2xl ${
                        message.isOwn
                          ? "bg-tennis-ball-500 text-white"
                          : `${theme.surface.card} ${theme.text.primary}`
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <div
                      className={`text-xs mt-1 flex items-center gap-1 ${
                        message.isOwn ? "justify-end mr-3" : "ml-3"
                      } ${theme.text.secondary}`}
                    >
                      <span>
                        {new Date(message.timestamp).toLocaleTimeString(
                          "ko-KR",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </span>
                      {message.isOwn && message.isRead && (
                        <span className="text-tennis-ball-500 text-xs">
                          읽음
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            ))
          )}
          </AnimatePresence>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div
        className={`${theme.surface.card} border-t ${theme.border.primary} px-4 py-3`}
      >
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="메시지를 입력하세요..."
            className={`flex-1 px-4 py-2 rounded-full border ${theme.border.primary} ${theme.surface.card} ${theme.text.primary} focus:outline-none focus:ring-2 focus:ring-tennis-ball-500 focus:border-transparent`}
          />
          <motion.button
            className={`p-2 rounded-full ${
              newMessage.trim() && !isSending
                ? "bg-tennis-ball-500 text-white"
                : `${theme.surface.card} ${theme.text.secondary}`
            }`}
            onClick={handleSendMessage}
            disabled={
              !newMessage.trim() || sendMessageMutation.isPending || isSending
            }
            whileTap={{ scale: 0.95 }}
          >
            <MdSend className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatRoomPage;
