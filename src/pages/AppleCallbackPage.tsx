import type { SupabaseClient } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getWeHandTennisAPI } from "../api";
import { supabase } from "../lib/supabase/client";
import { getThemeClasses } from "../lib/theme";

const AppleCallbackPage = () => {
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
    if (executedRef.current) {
      return;
    }

    executedRef.current = true;

    try {
      console.log("Apple OAuth 콜백 처리 시작...");
      console.log("Full URL:", window.location.href);

      // URL 파라미터 확인
      const hash = window.location.hash || "";
      const search = window.location.search || "";
      
      // Apple OAuth는 fragment(#) 대신 query string(?)으로 올 수 있음
      let errorParam = null;
      let errorDescription = null;
      
      if (hash) {
        const hashParams = new URLSearchParams(hash.substring(1));
        errorParam = hashParams.get("error");
        errorDescription = hashParams.get("error_description");
        console.log("Hash params:", Object.fromEntries(hashParams));
      }
      
      if (search) {
        const searchParams = new URLSearchParams(search);
        errorParam = errorParam || searchParams.get("error");
        errorDescription = errorDescription || searchParams.get("error_description");
        console.log("Search params:", Object.fromEntries(searchParams));
      }

      // 에러 체크
      if (errorParam) {
        console.error("OAuth error:", errorDescription);
        throw new Error(errorDescription || "OAuth 인증 실패");
      }

      // Supabase가 자동으로 세션을 처리하도록 대기
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 세션 가져오기
      const { data, error: sessionError } = await supabaseClient.auth.getSession();
      
      if (sessionError) {
        console.error("세션 가져오기 실패:", sessionError);
        throw new Error(sessionError.message);
      }
      
      const session = data.session;

      if (!session) {
        console.error("유효한 세션을 찾을 수 없습니다.");
        throw new Error("로그인 세션을 찾을 수 없습니다.");
      }

      const accessToken = session.access_token;
      const refreshToken = session.refresh_token;

      if (!accessToken || !refreshToken) {
        throw new Error("Access token 또는 refresh token이 없습니다.");
      }

      // 세션 재설정
      const { error: setSessionError } = await supabaseClient.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (setSessionError) {
        console.error("세션 설정 에러:", setSessionError);
        throw new Error("세션 설정 중 오류가 발생했습니다.");
      }

      console.log("Supabase 세션 정보:", {
        user: session.user,
        provider: session.user.app_metadata.provider,
        access_token: session.access_token ? "존재" : "없음",
      });

      const user = session.user;
      const provider = user.app_metadata.provider || "unknown";

      console.log("Apple user data:", {
        id: user.id,
        email: user.email,
        metadata: user.user_metadata,
        appMetadata: user.app_metadata
      });

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

      // 성공 시 메인 페이지로 리다이렉트
      const redirectTo = searchParams.get("next") || "/";
      setTimeout(() => navigate(redirectTo), 2000);
    } catch (error: any) {
      console.error("Apple OAuth 로그인 실패:", error);
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
              <div className="w-full h-full border-4 border-gray-700 border-t-gray-400 rounded-full animate-spin"></div>
            </div>
            <div>
              <h2 className={`text-2xl font-bold mb-2 ${theme.text.primary}`}>
                Apple로 로그인 중...
              </h2>
              <p className={`${theme.text.secondary}`}>
                Apple 계정으로 로그인하고 있어요
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

export default AppleCallbackPage;
