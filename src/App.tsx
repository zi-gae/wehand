import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { NuqsAdapter } from "nuqs/adapters/react-router";
import AuthGuard from "./components/AuthGuard";
import BottomNavigation from "./components/BottomNavigation";
import PWAUpdatePrompt, { usePWAUpdate } from "./components/PWAUpdatePrompt";
import SplashScreen from "./components/SplashScreen";
import { ThemeProvider } from "./contexts/ThemeContext";
import { usePrefetch } from "./hooks";
import { queryClient } from "./lib/queryClient";
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
import ProfilePage from "./pages/ProfilePage";
import ReviewPage from "./pages/ReviewPage";
import SignUpPage from "./pages/SignUpPage";
import TermsPage from "./pages/TermsPage";
import ProfileEditPage from "./pages/ProfileEditPage";

// Main App Content Component
const AppContent = () => {
  const [isAppReady, setIsAppReady] = useState(false);
  const { prefetchEssentialData, prefetchSecondaryData } = usePrefetch();
  const { updateAvailable, updateApp, dismissUpdate } = usePWAUpdate();

  const handleSplashComplete = () => {
    setIsAppReady(true);
    // 스플래시 완료 후 secondary 데이터 백그라운드 prefetch
    setTimeout(() => {
      prefetchSecondaryData();
    }, 1000);
  };

  const handlePrefetch = async () => {
    await prefetchEssentialData();
  };

  // PWA 설치 체크
  useEffect(() => {
    // PWA가 이미 설치되어 있거나 standalone 모드에서 실행 중인지 확인
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any)?.standalone;

    // 개발 환경에서는 항상 스플래시 표시
    const isDev = import.meta.env.DEV;

    // PWA나 개발 환경이 아닌 경우 스플래시 스킵 (선택적)
    if (!isStandalone && !isDev) {
      // 브라우저에서 실행 중인 경우에도 스플래시 표시하려면 이 조건문 제거
      // setIsAppReady(true);
    }
  }, []);

  if (!isAppReady) {
    return (
      <SplashScreen
        onComplete={handleSplashComplete}
        prefetchData={handlePrefetch}
      />
    );
  }

  return (
    <Router>
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
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
              </Routes>
            </main>
            <BottomNavigation />

            {/* PWA 업데이트 프롬프트 */}
            <PWAUpdatePrompt
              isVisible={updateAvailable}
              onUpdate={updateApp}
              onDismiss={dismissUpdate}
            />
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
