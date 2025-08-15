import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabase/client";
import { getThemeClasses } from "../lib/theme";

const AuthDeepLinkPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const theme = getThemeClasses();
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const handleDeepLinkAuth = async () => {
      try {
        const accessToken = searchParams.get("access_token");
        const refreshToken = searchParams.get("refresh_token");
        const next = searchParams.get("next") || "/";

        if (!accessToken || !refreshToken) {
          throw new Error("인증 토큰이 없습니다.");
        }

        // Supabase 세션 설정
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          throw new Error(error.message);
        }

        setStatus("success");
        
        // 성공 후 리다이렉트
        setTimeout(() => {
          navigate(decodeURIComponent(next));
        }, 1500);

      } catch (error: any) {
        console.error("딥링크 인증 실패:", error);
        setStatus("error");
        setErrorMessage(error.message || "인증 처리 중 오류가 발생했습니다.");
        
        // 실패 시 로그인 페이지로
        setTimeout(() => {
          navigate("/signup");
        }, 3000);
      }
    };

    handleDeepLinkAuth();
  }, [searchParams, navigate]);

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
                인증 처리 중...
              </h2>
              <p className={`${theme.text.secondary}`}>
                로그인 정보를 확인하고 있어요
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
                로그인 완료! 🎾
              </h2>
              <p className={`${theme.text.secondary}`}>
                환영합니다!
                <br />
                잠시 후 홈으로 이동합니다.
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
                잠시 후 로그인 페이지로 돌아갑니다.
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

export default AuthDeepLinkPage;