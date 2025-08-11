import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { getThemeClasses } from "../lib/theme";
import { supabase } from "../lib/supabase/client";

// 카카오 로고 SVG 컴포넌트
const KakaoLogo = () => (
  <svg
    width="18"
    height="17"
    viewBox="0 0 18 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9 0C4.03125 0 0 3.08929 0 6.89286C0 9.57857 1.71875 11.9464 4.21875 13.0179L3.375 16.5714C3.30469 16.8571 3.65625 17.0714 3.89062 16.8571L8.20312 13.6429C8.46094 13.6607 8.72656 13.6696 9 13.6696C13.9688 13.6696 18 10.5804 18 6.77679C18 2.97321 13.9688 -0.116071 9 -0.116071V0Z"
      fill="#3C1E1E"
    />
  </svg>
);

const SignUpPage = () => {
  const theme = getThemeClasses();
  const [isLoading, setIsLoading] = useState(false);

  const handleKakaoLogin = async () => {
    setIsLoading(true);
    try {
      console.log("카카오 로그인 시작...");

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "kakao",
        options: {
          redirectTo: `${window.location.origin}/auth/kakao/callback`,
        },
      });

      if (error) {
        console.error("카카오 로그인 실패:", error);
        alert("카카오 로그인에 실패했습니다. 다시 시도해 주세요.");
      }

      // OAuth는 자동으로 리다이렉트되므로 별도 처리 불필요
    } catch (error) {
      console.error("카카오 로그인 실패:", error);
      alert("카카오 로그인에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`min-h-screen ${theme.background.tennis} transition-colors duration-300 flex flex-col justify-center`}
    >
      <div className="px-6 py-8 max-w-md mx-auto space-y-8 w-full">
        {/* 로고 및 환영 메시지 */}
        <motion.div
          className="text-center space-y-4"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            className="w-20 h-20 mx-auto bg-gradient-to-br from-tennis-court-400 to-tennis-ball-500 rounded-full flex items-center justify-center shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          >
            <span className="text-2xl font-bold text-white">🎾</span>
          </motion.div>

          <div>
            <h2 className={`text-2xl font-bold mb-2 ${theme.text.primary}`}>
              위핸드에 오신 걸 환영해요!
            </h2>
            <p className={`${theme.text.secondary} leading-relaxed`}>
              테니스 매칭의 새로운 경험을 시작하세요.
            </p>
          </div>
        </motion.div>

        {/* 기능 소개 */}
        <motion.div
          className="space-y-4"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className={`text-lg font-semibold ${theme.text.primary} mb-4`}>
            위핸드와 함께하면
          </h3>

          {[
            {
              icon: "🎯",
              title: "스마트 매칭",
              desc: "내 실력과 위치에 딱 맞는 테니스 파트너 찾기",
            },
            {
              icon: "⚡",
              title: "빠른 참가",
              desc: "원터치로 간편하게 매치 참가 신청",
            },
            {
              icon: "💬",
              title: "실시간 소통",
              desc: "매치 참가자들과 언제든지 채팅으로 소통",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className={`flex items-center gap-4 p-4 rounded-2xl ${theme.surface.card} ${theme.border.primary} border`}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <motion.div
                className="w-10 h-10 rounded-full bg-gradient-to-br from-tennis-court-100 to-tennis-ball-100 dark:from-tennis-court-900/20 dark:to-tennis-ball-900/20 flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <span className="text-lg">{feature.icon}</span>
              </motion.div>
              <div className="flex-1">
                <h4 className={`font-semibold ${theme.text.primary}`}>
                  {feature.title}
                </h4>
                <p className={`text-sm ${theme.text.secondary}`}>
                  {feature.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* 카카오 로그인 버튼 */}
        <motion.div
          className="space-y-4"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <motion.button
            className={`w-full py-4 bg-yellow-400 text-gray-900 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3 ${
              isLoading
                ? "opacity-75 cursor-not-allowed"
                : "hover:bg-yellow-300 active:bg-yellow-500"
            }`}
            onClick={handleKakaoLogin}
            disabled={isLoading}
            whileHover={!isLoading ? { scale: 1.02, y: -2 } : {}}
            whileTap={!isLoading ? { scale: 0.98 } : {}}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 animate-spin border-2 border-gray-900 border-t-transparent rounded-full"></div>
                카카오 로그인 중...
              </>
            ) : (
              <>
                <KakaoLogo />
                카카오로 계속하기
              </>
            )}
          </motion.button>

          {/* 이용약관 및 개인정보처리방침 */}
          <motion.div
            className="text-center space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
          >
            <p className={`text-xs ${theme.text.secondary} leading-relaxed`}>
              가입하면 위핸드의{" "}
              <Link
                to="/terms"
                className="underline text-tennis-court-600 dark:text-tennis-court-400 hover:text-tennis-court-700 dark:hover:text-tennis-court-300 transition-colors"
              >
                이용약관
              </Link>
              과{" "}
              <Link
                to="/privacy"
                className="underline text-tennis-court-600 dark:text-tennis-court-400 hover:text-tennis-court-700 dark:hover:text-tennis-court-300 transition-colors"
              >
                개인정보처리방침
              </Link>
              에 동의하게 됩니다.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SignUpPage;
