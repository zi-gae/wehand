import { motion, AnimatePresence } from 'framer-motion';
import { MdNotifications, MdClose } from 'react-icons/md';
import { useState, useEffect } from 'react';
import { usePushNotifications } from '../hooks/usePushNotifications';
import { getThemeClasses, tennisGradients } from '../lib/theme';
import { useAuth } from '../hooks/useAuth';

const PushNotificationPrompt = () => {
  const theme = getThemeClasses();
  const { user } = useAuth();
  const { permission, isSupported, requestPermission, isLoading } = usePushNotifications();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // 로그인 상태이고, 지원되며, 권한이 기본값이고, 이전에 닫지 않았다면 표시
    const dismissed = localStorage.getItem('push_prompt_dismissed');
    const shouldShow = 
      user && 
      isSupported && 
      permission === 'default' && 
      !dismissed;
    
    if (shouldShow) {
      // 3초 후 표시 (사용자가 앱에 익숙해질 시간)
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [user, isSupported, permission]);

  const handleEnable = async () => {
    const granted = await requestPermission();
    if (granted) {
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('push_prompt_dismissed', 'true');
  };

  // 이미 권한이 있거나, 지원하지 않거나, 닫았으면 표시 안 함
  if (!isVisible || isDismissed || permission === 'granted') {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-24 left-4 right-4 z-50 max-w-md mx-auto"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <div className={`${theme.surface.card} rounded-2xl p-4 shadow-xl border ${theme.border.primary}`}>
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-full ${tennisGradients.primary}`}>
                <MdNotifications className="w-6 h-6 text-white" />
              </div>
              
              <div className="flex-1">
                <h3 className={`font-semibold ${theme.text.primary} mb-1`}>
                  알림을 놓치지 마세요!
                </h3>
                <p className={`text-sm ${theme.text.secondary} mb-3`}>
                  매치 참가 승인, 채팅 메시지 등 중요한 알림을 실시간으로 받아보세요.
                </p>
                
                <div className="flex gap-2">
                  <motion.button
                    className={`flex-1 py-2 px-4 rounded-xl font-medium text-white ${tennisGradients.primary}`}
                    onClick={handleEnable}
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading ? '설정 중...' : '알림 켜기'}
                  </motion.button>
                  
                  <motion.button
                    className={`py-2 px-4 rounded-xl font-medium ${theme.background.secondary} ${theme.text.secondary}`}
                    onClick={handleDismiss}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    나중에
                  </motion.button>
                </div>
              </div>
              
              <button
                className={`p-1 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 ${theme.text.secondary}`}
                onClick={handleDismiss}
              >
                <MdClose className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PushNotificationPrompt;