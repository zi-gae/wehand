import { motion } from "framer-motion";
import { MdSportsTennis } from "react-icons/md";
import { getThemeClasses } from "../lib/theme";

interface LoadingFallbackProps {
  type?: "list" | "detail" | "card";
  count?: number;
}

export const LoadingFallback = ({ type = "list", count = 3 }: LoadingFallbackProps) => {
  const theme = getThemeClasses();

  if (type === "detail") {
    return (
      <div className="space-y-6 px-2 py-4">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className={`rounded-3xl p-6 shadow-sm border ${theme.surface.card} ${theme.border.primary}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="animate-pulse">
              <div
                className={`h-6 ${theme.background.secondary} rounded mb-4`}
              ></div>
              <div
                className={`h-4 ${theme.background.secondary} rounded w-3/4 mb-2`}
              ></div>
              <div
                className={`h-4 ${theme.background.secondary} rounded w-1/2 mb-4`}
              ></div>
              <div className="flex justify-between">
                <div
                  className={`h-8 ${theme.background.secondary} rounded w-24`}
                ></div>
                <div
                  className={`h-8 ${theme.background.secondary} rounded w-20`}
                ></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === "card") {
    return (
      <div className="grid grid-cols-1 gap-4 px-6">
        {Array.from({ length: count }).map((_, i) => (
          <motion.div
            key={i}
            className={`rounded-3xl p-6 shadow-sm border ${theme.surface.card} ${theme.border.primary} transition-colors duration-300`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`h-6 ${theme.background.secondary} rounded w-32`}
                ></div>
                <div
                  className={`h-8 ${theme.background.secondary} rounded-full w-16`}
                ></div>
              </div>
              <div
                className={`h-4 ${theme.background.secondary} rounded w-2/3 mb-3`}
              ></div>
              <div
                className={`h-4 ${theme.background.secondary} rounded w-1/2 mb-4`}
              ></div>
              <div className="flex justify-between items-center">
                <div
                  className={`h-8 ${theme.background.secondary} rounded-full w-20`}
                ></div>
                <div
                  className={`h-6 ${theme.background.secondary} rounded w-16`}
                ></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  // Default list type
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="relative mb-6"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <MdSportsTennis className={`w-12 h-12 ${theme.text.accent}`} />
      </motion.div>
      
      <motion.h3
        className={`text-lg font-semibold ${theme.text.primary} mb-2`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        로딩 중...
      </motion.h3>
      
      <motion.p
        className={`${theme.text.secondary} text-sm`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        매치 정보를 불러오고 있습니다
      </motion.p>
    </motion.div>
  );
};

export default LoadingFallback;