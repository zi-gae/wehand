import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { MdSportsTennis } from "react-icons/md";
import { getThemeClasses, tennisGradients } from "../lib/theme";

interface SplashScreenProps {
  onComplete: () => void;
  prefetchData?: () => Promise<void>;
  isAuthenticated?: boolean;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete, prefetchData, isAuthenticated }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("WeHand 시작하는 중...");
  const theme = getThemeClasses();

  useEffect(() => {
    const startApp = async () => {
      // 인증되지 않은 사용자는 짧은 스플래시만 표시
      if (isAuthenticated === false) {
        const quickSteps = [
          { text: "WeHand 시작하는 중...", duration: 300 },
          { text: "준비 완료!", duration: 200 }
        ];

        for (let i = 0; i < quickSteps.length; i++) {
          const step = quickSteps[i];
          setLoadingText(step.text);
          setProgress(((i + 1) / quickSteps.length) * 100);
          await new Promise(resolve => setTimeout(resolve, step.duration));
        }

        setTimeout(() => {
          onComplete();
        }, 100);
        return;
      }

      // 인증된 사용자는 전체 로딩 프로세스
      const steps = [
        { text: "WeHand 시작하는 중...", duration: 400 },
        { text: "사용자 정보 확인 중...", duration: 600 },
        { text: "매치 데이터 불러오는 중...", duration: 1200 }, // prefetch 시간 고려
        { text: "커뮤니티 정보 동기화 중...", duration: 800 },
        { text: "준비 완료!", duration: 500 }
      ];

      let currentProgress = 0;
      
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        setLoadingText(step.text);
        
        // 프로그래스 바 애니메이션
        const targetProgress = ((i + 1) / steps.length) * 100;
        const progressInterval = setInterval(() => {
          currentProgress += 2;
          if (currentProgress >= targetProgress) {
            currentProgress = targetProgress;
            clearInterval(progressInterval);
          }
          setProgress(currentProgress);
        }, 20);
        
        // prefetch 데이터 (3번째 스텝에서)
        if (i === 2 && prefetchData) {
          try {
            await prefetchData();
          } catch (error) {
            console.log('Prefetch failed:', error);
          }
        }
        
        await new Promise(resolve => setTimeout(resolve, step.duration));
        clearInterval(progressInterval);
      }
      
      // 완료 후 약간의 지연
      setTimeout(() => {
        onComplete();
      }, 300);
    };

    startApp();
  }, [onComplete, prefetchData, isAuthenticated]);

  return (
    <div id="splash-screen" className={`fixed inset-0 z-50 flex items-center justify-center ${theme.background.tennis}`}>
      {/* 배경 애니메이션 */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className={`absolute -top-32 -left-32 w-64 h-64 ${tennisGradients.soft} rounded-full opacity-20`}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className={`absolute -bottom-32 -right-32 w-64 h-64 ${tennisGradients.primary} rounded-full opacity-10`}
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        
        {/* 테니스 볼 애니메이션 */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-tennis-court-400 rounded-full opacity-30"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 2) * 40}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      {/* 메인 컨텐츠 */}
      <div className="relative z-10 text-center px-8">
        {/* 로고 */}
        <motion.div
          className="mb-8"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 100, 
            damping: 20,
            delay: 0.2 
          }}
        >
          <div className={`inline-flex items-center justify-center w-24 h-24 ${tennisGradients.primary} rounded-3xl shadow-2xl mb-4`}>
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <MdSportsTennis className="w-12 h-12 text-white" />
            </motion.div>
          </div>
          
          {/* 앱 이름 */}
          <motion.h1
            className={`text-4xl font-bold ${theme.text.primary} mb-2`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            WeHand
          </motion.h1>
          
          <motion.p
            className={`text-lg ${theme.text.secondary}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            함께 치는 테니스
          </motion.p>
        </motion.div>

        {/* 로딩 섹션 */}
        <motion.div
          className="w-full max-w-sm mx-auto"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          {/* 프로그래스 바 */}
          <div className={`w-full h-2 ${theme.surface.secondary} rounded-full overflow-hidden mb-4`}>
            <motion.div
              className={`h-full ${tennisGradients.primary} origin-left`}
              style={{ width: `${progress}%` }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.3 }}
            />
          </div>
          
          {/* 로딩 텍스트 */}
          <motion.p
            className={`text-sm ${theme.text.secondary} text-center`}
            key={loadingText}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {loadingText}
          </motion.p>
          
          {/* 도트 애니메이션 */}
          <div className="flex justify-center mt-4 space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className={`w-2 h-2 ${theme.text.secondary} rounded-full opacity-50`}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SplashScreen;