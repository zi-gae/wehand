import { useEffect, useState, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getFCMToken,
  onForegroundMessage,
  checkNotificationPermission,
  showNotification,
  initializeMessaging,
} from "../lib/firebase";
import { useAuth } from "./useAuth";
import { getWeHandTennisAPI } from "@/api";

export const usePushNotifications = () => {
  const [permission, setPermission] =
    useState<NotificationPermission>("default");
  const [isSupported, setIsSupported] = useState(false);
  const { user } = useAuth();
  const api = getWeHandTennisAPI();

  // 브라우저 지원 확인
  useEffect(() => {
    const checkSupport = async () => {
      const messaging = await initializeMessaging();
      setIsSupported(!!messaging);
      setPermission(checkNotificationPermission());
    };

    checkSupport();
  }, []);

  // FCM 토큰 서버 전송 mutation
  const sendTokenMutation = useMutation({
    mutationFn: async (token: string) => {
      return api.postApiNotificationsFcmToken({
        fcmToken: token,
        deviceType: "web",
        deviceInfo: {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          language: navigator.language,
        },
      });
    },
    onSuccess: () => {
      console.log("FCM token sent to server successfully");
    },
    onError: (error) => {
      console.error("Failed to send FCM token to server:", error);
    },
  });

  // 알림 권한 요청 및 토큰 획득
  const requestPermission = useCallback(async () => {
    if (!isSupported) {
      console.warn("Push notifications are not supported");
      return false;
    }

    try {
      // 권한 요청
      const permission = await Notification.requestPermission();
      setPermission(permission);

      if (permission === "granted") {
        // FCM 토큰 획득
        const token = await getFCMToken();

        if (token && user) {
          // 서버에 토큰 전송
          await sendTokenMutation.mutateAsync(token);

          // 로컬 스토리지에 저장 (재전송 방지)
          localStorage.setItem("fcm_token", token);
          localStorage.setItem("fcm_token_sent_at", new Date().toISOString());

          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return false;
    }
  }, [isSupported, user, sendTokenMutation]);

  // 토큰 갱신 (24시간마다)
  const refreshToken = useCallback(async () => {
    const lastSent = localStorage.getItem("fcm_token_sent_at");

    if (lastSent) {
      const hoursSinceLastSent =
        (Date.now() - new Date(lastSent).getTime()) / (1000 * 60 * 60);

      if (hoursSinceLastSent < 24) {
        console.log("Token recently sent, skipping refresh");
        return;
      }
    }

    await requestPermission();
  }, [requestPermission]);

  // 포그라운드 메시지 리스너 설정
  useEffect(() => {
    if (!isSupported || permission !== "granted") return;

    const unsubscribe = onForegroundMessage((payload) => {
      console.log("Foreground message received:", payload);

      // 알림 표시
      const { notification, data } = payload;

      if (notification) {
        showNotification(notification.title || "WeHand 알림", {
          body: notification.body,
          icon: notification.icon || "/pwa-192x192.png",
          tag: data?.tag || "wehand-notification",
          data: data || {},
        });
      }

      // 알림 타입에 따른 추가 처리
      if (data?.type === "chat") {
        // 채팅 알림 처리 (예: 채팅 목록 새로고침)
        // queryClient.invalidateQueries(['chat']);
      } else if (data?.type === "match") {
        // 매치 알림 처리
        // queryClient.invalidateQueries(['matches']);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [isSupported, permission]);

  // 사용자 로그인 시 자동으로 토큰 전송
  useEffect(() => {
    if (user && isSupported && permission === "granted") {
      refreshToken();
    }
  }, [user, isSupported, permission, refreshToken]);

  return {
    permission,
    isSupported,
    requestPermission,
    refreshToken,
    isLoading: sendTokenMutation.isPending,
  };
};

// 알림 설정 페이지용 훅
export const useNotificationSettings = () => {
  const api = getWeHandTennisAPI();

  // 현재 설정 조회
  const { data: settings, refetch } = useQuery({
    queryKey: ["notification-settings"],
    queryFn: async () => {
      const response = await api.getApiNotificationsSettings();
      return response.data;
    },
  });

  // 설정 업데이트
  const updateSettings = useMutation({
    mutationFn: async (newSettings: any) => {
      return api.putApiNotificationsSettings(newSettings);
    },
    onSuccess: () => {
      refetch();
    },
  });

  return {
    settings,
    updateSettings: updateSettings.mutate,
    isUpdating: updateSettings.isPending,
  };
};
