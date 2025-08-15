import { QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/react-router";
import { useEffect, useState } from "react";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import AuthGuard from "./components/AuthGuard";
import BottomNavigation from "./components/BottomNavigation";
import PWAUpdatePrompt, { usePWAUpdate } from "./components/PWAUpdatePrompt";
import PushNotificationPrompt from "./components/PushNotificationPrompt";
import SplashScreen from "./components/SplashScreen";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useAuth, usePrefetch } from "./hooks";
import { queryClient } from "./lib/queryClient";
import AppleCallbackPage from "./pages/AppleCallbackPage";
import BoardDetailPage from "./pages/BoardDetailPage";
import BoardPage from "./pages/BoardPage";
import BoardWritePage from "./pages/BoardWritePage";
import ChatListPage from "./pages/ChatListPage";
import ChatRoomPage from "./pages/ChatRoomPage";
import CreatePage from "./pages/CreatePage";
import HomePage from "./pages/HomePage";
import KakaoCallbackPage from "./pages/KakaoCallbackPage";
import MatchDetailPage from "./pages/MatchDetailPage";
import MatchingPage from "./pages/MatchingPage";
import NotificationPage from "./pages/NotificationPage";
import PrivacyPage from "./pages/PrivacyPage";
import ProfileEditPage from "./pages/ProfileEditPage";
import ProfilePage from "./pages/ProfilePage";
import ReviewPage from "./pages/ReviewPage";
import SettingsPage from "./pages/SettingsPage";
import SignUpPage from "./pages/SignUpPage";
import TermsPage from "./pages/TermsPage";
import { ScrollToTop } from "./components/ScrollToTop";
import ShareProfilePage from "./pages/ShareProfilePage";
import AuthDeepLinkPage from "./pages/AuthDeepLinkPage";

// Main App Content Component
const AppContent = () => {
  const [isAppReady, setIsAppReady] = useState(false);
  const { prefetchEssentialData, prefetchSecondaryData } = usePrefetch();
  const { updateAvailable, updateApp, dismissUpdate } = usePWAUpdate();
  const { isAuthenticated } = useAuth();

  const handleSplashComplete = () => {
    setIsAppReady(true);
    // 인증된 사용자만 secondary 데이터 prefetch
    if (isAuthenticated) {
      setTimeout(() => {
        prefetchSecondaryData();
      }, 1000);
    }
  };

  const handlePrefetch = async () => {
    // 인증된 사용자만 essential 데이터 prefetch
    if (isAuthenticated) {
      await prefetchEssentialData();
    }
  };

  // PWA 설치 체크 및 사이드 패널 감지
  useEffect(() => {
    // PWA가 이미 설치되어 있거나 standalone 모드에서 실행 중인지 확인
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any)?.standalone;

    // 웹뷰 환경 감지
    const isWebView = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      // iOS 웹뷰 감지
      const isIOSWebView = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(userAgent);
      // Android 웹뷰 감지
      const isAndroidWebView = /wv|Android.*Version\/[\d\.]+/.test(userAgent) && /Version\/[\d\.]+/.test(userAgent);
      // 일반적인 웹뷰 감지 (Instagram, Facebook, KakaoTalk 등)
      const isInAppBrowser = /FBAN|FBAV|Instagram|KAKAOTALK|Line\/|Naver|SamsungBrowser/i.test(userAgent);
      
      return isIOSWebView || isAndroidWebView || isInAppBrowser;
    };

    // Edge 사이드 패널 감지 (너비가 500px 이하이고 높이가 충분히 큰 경우)
    const checkSidePanel = () => {
      const isSidePanel = window.innerWidth <= 500 && window.innerHeight > 600;
      if (isSidePanel) {
        document.body.classList.add("in-side-panel");
      } else {
        document.body.classList.remove("in-side-panel");
      }
    };

    checkSidePanel();
    window.addEventListener("resize", checkSidePanel);

    // 개발 환경에서는 항상 스플래시 표시
    const isDev = import.meta.env.DEV;

    // 웹뷰, PWA, 개발 환경에서는 항상 커스텀 스플래시 화면 표시
    // 일반 브라우저에서도 스플래시를 표시하므로 주석 처리
    // if (!isStandalone && !isDev && !isWebView()) {
    //   setIsAppReady(true);
    // }

    // 웹뷰 환경에서 PWA 기본 스플래시 비활성화를 위한 설정
    if (isWebView()) {
      // 웹뷰에서 실행 중임을 body에 클래스로 표시
      document.body.classList.add("in-webview");
      
      // iOS 웹뷰에서 바운스 효과 비활성화
      document.body.style.overscrollBehavior = 'none';
      
      // viewport 메타 태그 업데이트 (웹뷰 최적화)
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
      }
    }

    return () => {
      window.removeEventListener("resize", checkSidePanel);
    };
  }, []);

  if (!isAppReady) {
    return (
      <SplashScreen
        onComplete={handleSplashComplete}
        prefetchData={handlePrefetch}
        isAuthenticated={isAuthenticated ?? undefined}
      />
    );
  }

  return (
    <Router>
      <ScrollToTop />
      <NuqsAdapter>
        <AuthGuard>
          <div className="app">
            <main className="main-content relative overflow-hidden">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/matching" element={<MatchingPage />} />
                <Route path="/matching/:id" element={<MatchDetailPage />} />
                <Route path="/create" element={<CreatePage />} />
                <Route path="/board" element={<BoardPage />} />
                <Route path="/board/write" element={<BoardWritePage />} />
                <Route path="/board/:postId" element={<BoardDetailPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/profile/:userId" element={<ShareProfilePage />} />
                <Route path="/profile/edit" element={<ProfileEditPage />} />
                <Route path="/notifications" element={<NotificationPage />} />
                <Route path="/chat" element={<ChatListPage />} />
                <Route path="/chat/:roomId" element={<ChatRoomPage />} />
                <Route path="/reviews" element={<ReviewPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route
                  path="/auth/kakao/callback"
                  element={<KakaoCallbackPage />}
                />
                <Route
                  path="/auth/apple/callback"
                  element={<AppleCallbackPage />}
                />
                <Route
                  path="/auth/callback"
                  element={<AuthDeepLinkPage />}
                />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </main>
            <BottomNavigation />

            {/* PWA 업데이트 프롬프트 */}
            <PWAUpdatePrompt
              isVisible={updateAvailable}
              onUpdate={updateApp}
              onDismiss={dismissUpdate}
            />

            {/* 푸시 알림 프롬프트 */}
            <PushNotificationPrompt />
          </div>
        </AuthGuard>
      </NuqsAdapter>
    </Router>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
