import { motion } from "framer-motion";
import { MdLightMode, MdDarkMode } from "react-icons/md";
import { useTheme } from "../contexts/ThemeContext";
import { getThemeClasses } from "../lib/theme";

const ThemeToggle = () => {
  const { isDark, toggle } = useTheme();
  const theme = getThemeClasses();

  return (
    <motion.button
      onClick={toggle}
      className={`
        relative p-3 rounded-full transition-all duration-300
        ${theme.surface.glassCard} ${theme.text.primary}
        shadow-lg hover:shadow-xl
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isDark ? "라이트 모드로 변경" : "다크 모드로 변경"}
    >
      <motion.div
        className="relative w-6 h-6 flex items-center justify-center"
        initial={false}
        animate={{ rotate: isDark ? 180 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {isDark ? (
          <motion.div
            key="dark"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="text-secondary-400"
          >
            <MdDarkMode className="w-6 h-6" />
          </motion.div>
        ) : (
          <motion.div
            key="light"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="text-secondary-500"
          >
            <MdLightMode className="w-6 h-6" />
          </motion.div>
        )}
      </motion.div>
      
      {/* Decorative background circles */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-primary-200/30 dark:border-primary-700/30"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.button>
  );
};

export default ThemeToggle;