import {
  // useInfiniteQuery,  // 제거: 무한 스크롤 사용 안 함
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  CreateChatRoomRequest,
  getWeHandTennisAPI,
  PostApiChatRoomsChatRoomIdReadBody,
  SendMessageRequestMessageType,
} from "../api";

// Query Keys
export const chatQueryKeys = {
  all: ["chats"] as const,
  rooms: () => [...chatQueryKeys.all, "rooms"] as const,
  room: (id: string) => [...chatQueryKeys.all, "room", id] as const,
  messages: (roomId: string) =>
    [...chatQueryKeys.all, "messages", roomId] as const,
} as const;

// 채팅방 목록 조회 훅
export const useChatRooms = (params?: { page?: number; limit?: number }) => {
  const api = getWeHandTennisAPI();

  return useQuery({
    queryKey: chatQueryKeys.rooms(),
    queryFn: () => api.getApiChatRooms(params),
  });
};

// 특정 채팅방 조회 훅
export const useChatRoom = (roomId: string) => {
  const api = getWeHandTennisAPI();

  return useQuery({
    queryKey: chatQueryKeys.room(roomId),
    queryFn: () => api.getApiChatRoomsChatRoomId(roomId),
    enabled: !!roomId,
  });
};

// Suspense를 위한 특정 채팅방 조회 훅
export const useSuspenseChatRoom = (roomId: string) => {
  const api = getWeHandTennisAPI();

  return useSuspenseQuery({
    queryKey: chatQueryKeys.room(roomId),
    queryFn: () => api.getApiChatRoomsChatRoomId(roomId),
  });
};

// 메시지 전송 훅
export const useSendMessage = () => {
  const queryClient = useQueryClient();
  const api = getWeHandTennisAPI();

  return useMutation({
    mutationFn: ({
      roomId,
      content,
      messageType = "text",
      replyTo,
    }: {
      roomId: string;
      content: string;
      messageType?: SendMessageRequestMessageType;
      replyTo?: string;
    }) =>
      api
        .postApiChatRoomsChatRoomIdMessages(roomId, {
          content,
          message_type: messageType,
          reply_to: replyTo,
        })
        .then((response) => response.data),
    onSuccess: (_data, variables) => {
      // 해당 채팅방의 메시지 목록 업데이트
      queryClient.invalidateQueries({
        queryKey: chatQueryKeys.messages(variables.roomId),
      });
      queryClient.invalidateQueries({
        queryKey: chatQueryKeys.room(variables.roomId),
      });
      // 채팅방 목록도 업데이트 (마지막 메시지 반영)
      queryClient.invalidateQueries({
        queryKey: chatQueryKeys.rooms(),
      });
    },
  });
};

// 채팅방 메시지 목록 조회 훅
export const useChatMessages = (
  roomId: string,
  options?: {
    enabled?: boolean;
  }
) => {
  const api = getWeHandTennisAPI();

  return useQuery({
    queryKey: chatQueryKeys.messages(roomId),
    enabled: options?.enabled ?? !!roomId,
    queryFn: () =>
      api.getApiChatRoomsChatRoomIdMessages(roomId, { limit: 10000 }),
  });
};

// 채팅방 메시지 전체 목록 조회 훅
export const useChatAllMessages = (
  roomId: string,
  options?: {
    enabled?: boolean;
  }
) => {
  const api = getWeHandTennisAPI();

  return useQuery({
    queryKey: chatQueryKeys.messages(roomId),
    enabled: options?.enabled ?? !!roomId,
    queryFn: () => api.getApiChatRoomsChatRoomIdMessagesAll(roomId),
  });
};

// 채팅방 생성 훅
export const useCreateChatRoom = () => {
  const queryClient = useQueryClient();
  const api = getWeHandTennisAPI();

  return useMutation({
    mutationFn: (roomData: CreateChatRoomRequest) =>
      api.postApiChatRooms(roomData).then((response) => response.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatQueryKeys.rooms() });
    },
  });
};

// 채팅방 읽음 처리 훅
export const useMarkChatRoomAsRead = () => {
  const queryClient = useQueryClient();
  const api = getWeHandTennisAPI();

  return useMutation({
    mutationFn: ({
      roomId,
      body,
    }: {
      roomId: string;
      body: PostApiChatRoomsChatRoomIdReadBody;
    }) =>
      api
        .postApiChatRoomsChatRoomIdRead(roomId, body)
        .then((response) => response),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: chatQueryKeys.room(variables.roomId),
      });
      queryClient.invalidateQueries({ queryKey: chatQueryKeys.rooms() });
    },
  });
};

// 채팅방 나가기 훅
export const useLeaveChatRoom = () => {
  const queryClient = useQueryClient();
  const api = getWeHandTennisAPI();

  return useMutation({
    mutationFn: (roomId: string) =>
      api.postApiChatRoomsChatRoomIdLeave(roomId).then((response) => response),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatQueryKeys.rooms() });
    },
  });
};

// 채팅방 참여 훅
export const useJoinChatRoom = () => {
  const queryClient = useQueryClient();
  const api = getWeHandTennisAPI();

  return useMutation({
    mutationFn: ({ roomId }: { roomId: string }) =>
      api.postApiChatRoomsChatRoomIdJoin(roomId).then((response) => response),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatQueryKeys.rooms() });
    },
  });
};

// 매치 참가자 승인 훅 (호스트 전용)
export const useApproveParticipant = () => {
  const queryClient = useQueryClient();
  const api = getWeHandTennisAPI();

  return useMutation({
    mutationFn: ({ roomId }: { roomId: string }) =>
      api.postApiChatRoomsChatRoomIdApprove(roomId).then((res) => res),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: chatQueryKeys.room(variables.roomId),
      });
      queryClient.invalidateQueries({ queryKey: chatQueryKeys.rooms() });
    },
  });
};

// 매치 참가자 승인 취소 훅 (호스트 전용)
export const useCancelParticipantApproval = () => {
  const queryClient = useQueryClient();
  const api = getWeHandTennisAPI();

  return useMutation({
    mutationFn: ({ roomId }: { roomId: string }) =>
      api.postApiChatRoomsChatRoomIdCancelApproval(roomId).then((res) => res),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: chatQueryKeys.room(variables.roomId),
      });
      queryClient.invalidateQueries({ queryKey: chatQueryKeys.rooms() });
    },
  });
};

// 읽지 않은 메시지 개수 조회 훅
export const useUnreadMessageCount = () => {
  const api = getWeHandTennisAPI();

  return useQuery({
    queryKey: [...chatQueryKeys.all, "unread-count"],
    queryFn: () =>
      api.getApiChatRooms({ limit: 100 }).then((response) => {
        // 채팅방 목록에서 읽지 않은 메시지 개수 합산
        const rooms = response.data || [];
        return {
          count: rooms.reduce((acc, room) => acc + (room.unreadCount || 0), 0),
        };
      }),
    staleTime: 1 * 60 * 1000, // 1분
    refetchInterval: 30 * 1000, // 30초마다 자동 리패치
  });
};

// Suspense를 위한 읽지 않은 메시지 개수 조회 훅
export const useSuspenseUnreadMessageCount = () => {
  const api = getWeHandTennisAPI();

  return useSuspenseQuery({
    queryKey: [...chatQueryKeys.all, "unread-count"],
    queryFn: () =>
      api.getApiChatRooms({ limit: 100 }).then((response) => {
        // 채팅방 목록에서 읽지 않은 메시지 개수 합산
        const rooms = response.data || [];
        return {
          count: rooms.reduce((acc, room) => acc + (room.unreadCount || 0), 0),
        };
      }),
    staleTime: 1 * 60 * 1000, // 1분
    refetchInterval: 30 * 1000, // 30초마다 자동 리패치
  });
};
