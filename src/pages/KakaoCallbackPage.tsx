import type { SupabaseClient } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getWeHandTennisAPI } from "../api";
import { supabase } from "../lib/supabase/client";
import { getThemeClasses } from "../lib/theme";
import { logger } from "@/lib/logger";

const KakaoCallbackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const theme = getThemeClasses();
  const executedRef = useRef<boolean>(false);
  const [supabaseClient] = useState<SupabaseClient>(supabase);
  const api = getWeHandTennisAPI();

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleOAuthCallback = useCallback(async (): Promise<void> => {
    // Prevent rerun on DEV mode (React StrictMode 대응)

    logger.auth("KakaoCallbackPage mounted");

    if (executedRef.current) {
      return;
    }

    logger.auth("KakaoCallbackPage callback handler started");

    executedRef.current = true;

    try {
      console.log("OAuth 콜백 처리 시작...");
      logger.auth("OAuth 콜백 처리 시작...");

      const hash = window.location.hash || "#";
      const hashParams = new URLSearchParams(hash.split("#")[1]);
      const providerParam = searchParams.get("provider") || "kakao";

      console.log(`OAuth callback from provider: ${providerParam}`);
      console.log("URL hash:", hash);
      console.log("Search params:", searchParams.toString());
      logger.auth(`OAuth callback from provider: ${providerParam}`);
      logger.auth("URL hash:", hash);

      // 에러 체크
      if (hashParams.get("error")) {
        console.error("OAuth error:", hashParams.get("error_description"));
        throw new Error(
          hashParams.get("error_description") || "OAuth 인증 실패"
        );
      }

      // OAuth 인증 코드로 세션 교환 (카카오는 hash에 토큰이 직접 옴)
      let session = null;
      let accessToken = null;
      let refreshToken = null;

      // hash에서 직접 토큰 추출 시도
      if (hashParams.get("access_token")) {
        accessToken = hashParams.get("access_token");
        refreshToken = hashParams.get("refresh_token");

        if (accessToken && refreshToken) {
          // 토큰으로 세션 설정
          const { data: sessionData, error: setSessionError } =
            await supabaseClient.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

          logger.auth("세션 설정 결과:", sessionData);

          if (setSessionError) {
            console.error("세션 설정 에러:", setSessionError);
            throw new Error("세션 설정 중 오류가 발생했습니다.");
          }

          session = sessionData.session;
        }
      }

      // 세션이 없으면 기존 세션 확인
      if (!session) {
        const { data } = await supabaseClient.auth.getSession();
        session = data.session;
        logger.auth("현재 세션 정보:", session);
      }

      if (!session) {
        console.error("유효한 세션을 찾을 수 없습니다.");
        throw new Error("로그인 세션을 찾을 수 없습니다.");
      }

      accessToken = session.access_token;
      refreshToken = session.refresh_token;

      if (!accessToken || !refreshToken) {
        // 토큰이 없으면 토큰 갱신 시도
        console.log("토큰이 없어서 갱신 시도...");
        const { data: refreshData, error: refreshError } =
          await supabaseClient.auth.refreshSession();

        if (!refreshError && refreshData?.session) {
          session = refreshData.session;
          accessToken = session.access_token;
          refreshToken = session.refresh_token;
        } else {
          throw new Error("Access token 또는 refresh token이 없습니다.");
        }
      }

      console.log("Supabase 세션 정보:", {
        user: session.user,
        provider: session.user.app_metadata.provider,
        access_token: session.access_token ?? "없음",
      });
      logger.auth("Supabase 세션 정보:", {
        user: session.user,
        provider: session.user.app_metadata.provider,
        access_token: session.access_token ?? "없음",
        refresh_token: session.refresh_token ?? "없음",
      });

      const user = session.user;
      const provider = user.app_metadata.provider || "unknown";

      // 모든 사용자에 대해 hyper-responder Edge Function 호출
      try {
        console.log("hyper-responder 함수 호출...");
        const { data: hyperData, error: hyperError } =
          await supabaseClient.functions.invoke("hyper-responder", {
            body: {
              id: user.id,
              email: user.email,
              name: user.user_metadata.name || user.user_metadata.full_name,
              role: "member",
            },
          });

        console.log("hyper-responder 함수 호출 결과:", hyperData);
        if (hyperError) {
          console.warn("hyper-responder 함수 호출 실패:", hyperError);
        } else {
          console.log("hyper-responder 함수 호출 성공:", hyperData);
        }
      } catch (hyperError) {
        console.warn("hyper-responder 함수 호출 중 오류:", hyperError);
        // hyper-responder 실패해도 로그인은 계속 진행
      }

      setStatus("success");

      // 성공 시 리다이렉트 처리
      const redirectTo = searchParams.get("next") || "/";

      // iOS 앱에서 웹으로 콜백 받은 경우, 다시 앱으로 리다이렉트
      const isWebCallback =
        window.location.protocol === "https:" &&
        (window.location.hostname === "wehand.zigae.com" ||
          window.location.hostname === "wehand.tennis");

      if (isWebCallback) {
        // 세션 토큰을 URL 파라미터로 전달하여 앱으로 리다이렉트
        const deepLinkUrl = `wehand://auth/callback?access_token=${accessToken}&refresh_token=${refreshToken}&next=${encodeURIComponent(
          redirectTo
        )}`;

        // Android와 iOS 모두 지원
        try {
          window.location.href = deepLinkUrl;
        } catch (error) {
          // 딥링크 실패 시 폴백
          console.warn("딥링크 실패, 폴백 처리:", error);
          setTimeout(() => navigate(redirectTo), 2000);
        }
      } else {
        // 일반 웹에서는 기존 로직 유지
        setTimeout(() => navigate(redirectTo), 2000);
      }
    } catch (error: any) {
      console.error("OAuth 로그인 실패:", error);
      setStatus("error");
      setErrorMessage(error.message || "로그인 중 오류가 발생했습니다.");
      setTimeout(() => navigate("/signup"), 3000);
    }
  }, [searchParams, navigate, supabaseClient, api]);

  useEffect(() => {
    handleOAuthCallback().catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderContent = () => {
    switch (status) {
      case "loading":
        return (
          <motion.div
            className="text-center space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-20 h-20 mx-auto">
              <div className="w-full h-full border-4 border-tennis-court-300 border-t-tennis-court-600 rounded-full animate-spin"></div>
            </div>
            <div>
              <h2 className={`text-2xl font-bold mb-2 ${theme.text.primary}`}>
                로그인 중...
              </h2>
              <p className={`${theme.text.secondary}`}>
                소셜 계정으로 로그인하고 있어요
              </p>
            </div>
          </motion.div>
        );

      case "success":
        return (
          <motion.div
            className="text-center space-y-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
              >
                ✅
              </motion.div>
            </div>
            <div>
              <h2 className={`text-2xl font-bold mb-2 ${theme.text.primary}`}>
                환영합니다! 🎾
              </h2>
              <p className={`${theme.text.secondary}`}>
                로그인이 완료되었습니다.
                <br />
                잠시 후 메인 페이지로 이동합니다.
              </p>
            </div>
          </motion.div>
        );

      case "error":
        return (
          <motion.div
            className="text-center space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">❌</span>
            </div>
            <div>
              <h2 className={`text-2xl font-bold mb-2 ${theme.text.primary}`}>
                로그인 실패
              </h2>
              <p className={`${theme.text.secondary}`}>
                {errorMessage}
                <br />
                잠시 후 회원가입 페이지로 돌아갑니다.
              </p>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`min-h-screen ${theme.background.tennis} flex items-center justify-center px-6`}
    >
      <div
        className={`w-full max-w-md p-8 rounded-3xl ${theme.surface.card} ${theme.border.primary} border shadow-lg`}
      >
        {renderContent()}
      </div>
    </motion.div>
  );
};

export default KakaoCallbackPage;
