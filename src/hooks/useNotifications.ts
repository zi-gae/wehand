import {
  useQuery,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  getWeHandTennisAPI,
  UpdateNotificationSettingsRequest,
  UpdateFcmTokenRequest,
  GetApiNotificationsParams,
} from "../api";

// Query Keys
export const notificationQueryKeys = {
  all: ["notifications"] as const,
  lists: () => [...notificationQueryKeys.all, "list"] as const,
  list: (params?: Record<string, any>) =>
    [...notificationQueryKeys.lists(), params || {}] as const,
  infinite: (params?: Record<string, any>) =>
    [...notificationQueryKeys.all, "infinite", params || {}] as const,
  unreadCount: () => [...notificationQueryKeys.all, "unread-count"] as const, // 전체
  unreadChatCount: () =>
    [...notificationQueryKeys.all, "unread-chat-count"] as const, // 채팅 전용
  unreadCountByType: () =>
    [...notificationQueryKeys.all, "unread-count-by-type"] as const, // 타입별
  settings: () => [...notificationQueryKeys.all, "settings"] as const,
} as const;

// 알림 목록 조회 훅
export const useNotifications = (params?: {
  page?: number;
  limit?: number;
  type?: string;
  unread_only?: boolean;
}) => {
  const api = getWeHandTennisAPI();

  return useQuery({
    queryKey: notificationQueryKeys.list(params),
    queryFn: () =>
      api
        .getApiNotifications({
          page: params?.page,
          limit: params?.limit,
          type: params?.type as any,
          unread_only: params?.unread_only as any,
        })
        .then((response) => response.data),
    staleTime: 1 * 60 * 1000, // 1분 (알림은 자주 업데이트)
    refetchInterval: 30 * 1000, // 30초마다 자동 리패치
  });
};

// 알림 읽음 처리 훅
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  const api = getWeHandTennisAPI();

  return useMutation({
    mutationFn: (notificationId: string) =>
      api
        .postApiNotificationsNotificationIdRead(notificationId)
        .then((response) => response),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all });
    },
  });
};

// 모든 알림 읽음 처리 훅
export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  const api = getWeHandTennisAPI();

  return useMutation({
    mutationFn: () =>
      api.postApiNotificationsReadAll().then((response) => response),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all });
    },
  });
};

// 알림 삭제 훅
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  const api = getWeHandTennisAPI();

  return useMutation({
    mutationFn: (notificationId: string) =>
      api
        .deleteApiNotificationsNotificationId(notificationId)
        .then((response) => response),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationQueryKeys.lists(),
      });
    },
  });
};

// 알림 설정 조회 훅
export const useNotificationSettings = () => {
  const api = getWeHandTennisAPI();

  return useQuery({
    queryKey: notificationQueryKeys.settings(),
    queryFn: () =>
      api.getApiNotificationsSettings().then((response) => response.data),
    staleTime: 10 * 60 * 1000, // 10분
  });
};

// 알림 설정 업데이트 훅
export const useUpdateNotificationSettings = () => {
  const queryClient = useQueryClient();
  const api = getWeHandTennisAPI();

  return useMutation({
    mutationFn: (settings: UpdateNotificationSettingsRequest) =>
      api.putApiNotificationsSettings(settings).then((response) => response),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationQueryKeys.settings(),
      });
    },
  });
};

// FCM 토큰 등록/업데이트 훅
export const useUpdateFcmToken = () => {
  const api = getWeHandTennisAPI();

  return useMutation({
    mutationFn: (tokenData: UpdateFcmTokenRequest) =>
      api.postApiNotificationsFcmToken(tokenData).then((response) => response),
  });
};

export const useSuspenseNotifications = (
  options: GetApiNotificationsParams
) => {
  const api = getWeHandTennisAPI();

  return useSuspenseQuery({
    queryKey: notificationQueryKeys.list(),
    queryFn: () =>
      api.getApiNotifications(options).then((response) => response.data),
  });
};
export const useSuspenseUnreadNotificationCount = () => {
  const api = getWeHandTennisAPI();

  return useSuspenseQuery({
    queryKey: notificationQueryKeys.unreadCount(),
    queryFn: () =>
      api.getApiNotificationsUnreadCount().then((response) => response.data),
  });
};

// 읽지 않은 알림 개수 조회 훅
export const useUnreadNotificationCount = () => {
  const api = getWeHandTennisAPI();

  return useQuery({
    queryKey: notificationQueryKeys.unreadCount(),
    queryFn: () =>
      api.getApiNotificationsUnreadCount().then((response) => response.data),
  });
};

export const useUnreadChatNotificationCount = () => {
  const api = getWeHandTennisAPI();

  return useQuery({
    queryKey: notificationQueryKeys.unreadChatCount(),
    queryFn: () =>
      api
        .getApiNotificationsUnreadChatCount()
        .then((response) => response.data),
  });
};
