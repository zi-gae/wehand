import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
} from "firebase/messaging";

// Firebase 설정 (실제 프로젝트 설정으로 교체 필요)
const firebaseConfig = {
  apiKey: "", //process.env.VITE_FIREBASE_API_KEY || "your-api-key",
  authDomain: "", //process.env.VITE_FIREBASE_AUTH_DOMAIN || "your-auth-domain",
  projectId: "", //process.env.VITE_FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: "", //process.env.VITE_FIREBASE_STORAGE_BUCKET || "your-storage-bucket",
  messagingSenderId: "", //process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "your-sender-id",
  appId: "", //process.env.VITE_FIREBASE_APP_ID || "your-app-id",
  measurementId: "", //process.env.VITE_FIREBASE_MEASUREMENT_ID || "your-measurement-id",
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// Messaging 인스턴스 가져오기
let messaging: any = null;

// 브라우저가 FCM을 지원하는지 확인
export const initializeMessaging = async () => {
  const supported = await isSupported();

  if (supported) {
    messaging = getMessaging(app);
    return messaging;
  }

  console.warn("This browser does not support FCM");
  return null;
};

// FCM 토큰 가져오기
export const getFCMToken = async (): Promise<string | null> => {
  try {
    if (!messaging) {
      messaging = await initializeMessaging();
    }

    if (!messaging) {
      console.warn("Messaging is not initialized");
      return null;
    }

    // 알림 권한 요청
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.warn("Notification permission denied");
      return null;
    }

    // VAPID 키 (Firebase Console에서 가져온 값으로 교체 필요)
    const vapidKey = ""; //process.env.VITE_FIREBASE_VAPID_KEY || "your-vapid-key";

    // 토큰 가져오기
    const token = await getToken(messaging, { vapidKey });

    if (token) {
      console.log("FCM Token:", token);
      return token;
    } else {
      console.warn("No registration token available");
      return null;
    }
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
};

// 포그라운드 메시지 수신 리스너
export const onForegroundMessage = (callback: (payload: any) => void) => {
  if (!messaging) {
    console.warn("Messaging is not initialized");
    return () => {};
  }

  return onMessage(messaging, (payload) => {
    console.log("Foreground message received:", payload);
    callback(payload);
  });
};

// 알림 권한 상태 확인
export const checkNotificationPermission = (): NotificationPermission => {
  if (!("Notification" in window)) {
    console.warn("This browser does not support notifications");
    return "denied";
  }

  return Notification.permission;
};

// 알림 표시
export const showNotification = (
  title: string,
  options?: NotificationOptions
) => {
  if (checkNotificationPermission() === "granted") {
    new Notification(title, {
      icon: "/pwa-192x192.png",
      badge: "/pwa-192x192.png",
      ...options,
    });
  }
};
