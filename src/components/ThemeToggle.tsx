import { motion } from "framer-motion";
import { useEffect } from "react";
import { MdLightMode, MdDarkMode } from "react-icons/md";
import { useTheme } from "../contexts/ThemeContext";
import { getThemeClasses } from "../lib/theme";

const ThemeToggle = () => {
  const { isDark, toggle } = useTheme();
  const theme = getThemeClasses();

  // status bar 색상 업데이트
  useEffect(() => {
    const updateStatusBarColor = () => {
      // iOS Safari status bar
      let statusBarMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
      if (!statusBarMeta) {
        statusBarMeta = document.createElement('meta');
        statusBarMeta.setAttribute('name', 'apple-mobile-web-app-status-bar-style');
        document.head.appendChild(statusBarMeta);
      }
      statusBarMeta.setAttribute('content', isDark ? 'black-translucent' : 'default');

      // theme-color meta tag
      let themeColorMeta = document.querySelector('meta[name="theme-color"]');
      if (!themeColorMeta) {
        themeColorMeta = document.createElement('meta');
        themeColorMeta.setAttribute('name', 'theme-color');
        document.head.appendChild(themeColorMeta);
      }
      themeColorMeta.setAttribute('content', isDark ? '#1f2937' : '#ffffff');

      // msapplication-navbutton-color (Windows Phone)
      let msNavButtonMeta = document.querySelector('meta[name="msapplication-navbutton-color"]');
      if (!msNavButtonMeta) {
        msNavButtonMeta = document.createElement('meta');
        msNavButtonMeta.setAttribute('name', 'msapplication-navbutton-color');
        document.head.appendChild(msNavButtonMeta);
      }
      msNavButtonMeta.setAttribute('content', isDark ? '#1f2937' : '#ffffff');
    };

    updateStatusBarColor();
  }, [isDark]);

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