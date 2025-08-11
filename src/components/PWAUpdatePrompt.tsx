import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { MdRefresh, MdClose } from "react-icons/md";
import { getThemeClasses, tennisGradients } from "../lib/theme";

interface PWAUpdatePromptProps {
  onUpdate: () => void;
  onDismiss: () => void;
  isVisible: boolean;
}

const PWAUpdatePrompt: React.FC<PWAUpdatePromptProps> = ({
  onUpdate,
  onDismiss,
  isVisible
}) => {
  const theme = getThemeClasses();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-20 left-4 right-4 z-50"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <motion.div
            className={`${theme.surface.card} rounded-2xl shadow-2xl border ${theme.border.primary} p-4 backdrop-blur-md`}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 ${tennisGradients.primary} rounded-full`}>
                  <MdRefresh className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className={`font-semibold ${theme.text.primary}`}>
                    새로운 버전 사용 가능
                  </h3>
                  <p className={`text-sm ${theme.text.secondary}`}>
                    더 나은 기능과 성능을 경험하세요
                  </p>
                </div>
              </div>
              <motion.button
                onClick={onDismiss}
                className={`p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <MdClose className={`w-5 h-5 ${theme.text.secondary}`} />
              </motion.button>
            </div>

            <div className="flex gap-2">
              <motion.button
                onClick={onDismiss}
                className={`flex-1 py-2 px-4 ${theme.surface.secondary} ${theme.text.secondary} rounded-xl text-sm font-medium border ${theme.border.primary} transition-colors hover:bg-gray-100 dark:hover:bg-gray-700`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                나중에
              </motion.button>
              <motion.button
                onClick={onUpdate}
                className={`flex-1 py-2 px-4 ${tennisGradients.primary} text-white rounded-xl text-sm font-medium shadow-md`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                지금 업데이트
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// PWA 업데이트 관리 훅
export const usePWAUpdate = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        setRegistration(reg);
        
        // 업데이트 체크
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setUpdateAvailable(true);
              }
            });
          }
        });

        // 정기적으로 업데이트 체크 (1시간마다)
        setInterval(() => {
          reg.update();
        }, 60 * 60 * 1000);
      });
    }
  }, []);

  const updateApp = () => {
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  };

  const dismissUpdate = () => {
    setUpdateAvailable(false);
  };

  return {
    updateAvailable,
    updateApp,
    dismissUpdate
  };
};

export default PWAUpdatePrompt;