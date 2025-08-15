import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface AuthGuardProps {
  children: React.ReactNode;
}

// 인증이 필요없는 페이지들
const PUBLIC_ROUTES = ["/signup", "/auth/kakao/callback", "/auth/apple/callback", "/auth/apple/test-callback", "/auth/callback", "/terms", "/privacy"];

const AuthGuard = ({ children }: AuthGuardProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 현재 페이지가 공개 페이지인지 확인
    const isPublicRoute = PUBLIC_ROUTES.some((route) =>
      location.pathname.startsWith(route)
    );

    // 공개 페이지면 인증 체크 스킵
    if (isPublicRoute) {
      return;
    }

    // 로그인 상태 확인 (localStorage에서 토큰 체크)
    const storage = localStorage.getItem("sb-cylkhqezhacwheqlstvf-auth-token");

    let user, accessToken;
    if (storage) {
      try {
        const parsed = JSON.parse(storage);
        user = parsed.user;
        accessToken = parsed.access_token;
      } catch (e) {
        user = null;
        accessToken = null;
      }
    }

    // 로그인되지 않은 경우 회원가입 페이지로 리다이렉트
    if (!accessToken || !user) {
      navigate("/signup", { replace: true });
    }
  }, [navigate, location.pathname]);

  return <>{children}</>;
};

export default AuthGuard;
