import { motion } from "framer-motion";
import { useState } from "react";
import {
  MdArrowBack,
  MdPersonRemove,
  MdDescription,
  MdSecurity,
  MdWarning,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { getThemeClasses } from "../lib/theme";

const SettingsPage = () => {
  const navigate = useNavigate();
  const theme = getThemeClasses();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const menuItems = [
    {
      id: 1,
      icon: MdDescription,
      title: "이용약관",
      description: "서비스 이용약관 확인",
      color: "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20",
      path: "/terms",
    },
    {
      id: 2,
      icon: MdSecurity,
      title: "개인정보처리방침",
      description: "개인정보 처리 및 보호 정책",
      color: "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20",
      path: "/privacy",
    },
    {
      id: 3,
      icon: MdPersonRemove,
      title: "회원 탈퇴",
      description: "계정을 삭제하고 모든 데이터를 제거",
      color: "text-status-error-600 bg-status-error-100 dark:text-status-error-400 dark:bg-status-error-900/20",
      path: null,
      dangerous: true,
    },
  ];

  const handleMenuClick = (item: typeof menuItems[0]) => {
    if (item.path) {
      navigate(item.path);
    } else if (item.id === 3) {
      setShowDeleteModal(true);
    }
  };

  const handleDeleteAccount = () => {
    // TODO: 회원탈퇴 API 호출
    console.log("회원탈퇴 처리");
    setShowDeleteModal(false);
  };

  const handleDeleteCancel = () => setShowDeleteModal(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`min-h-screen ${theme.background.tennis} page-content pb-safe transition-colors duration-300`}
    >
      {/* Header */}
      <motion.header
        className={`${theme.background.glass} ${theme.text.primary} shadow-sm sticky top-0 z-40 transition-colors duration-300`}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex items-center px-6 py-4">
          <motion.button
            className={`p-2 -ml-2 rounded-full hover:bg-tennis-court-50 dark:hover:bg-tennis-court-900/20 transition-colors`}
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MdArrowBack className={`w-6 h-6 ${theme.text.primary}`} />
          </motion.button>

          <h1 className={`text-lg font-bold ml-4 ${theme.text.primary}`}>
            설정
          </h1>
        </div>
      </motion.header>

      {/* Content */}
      <div className="px-2 py-4">
        {/* Menu Items */}
        <motion.div
          className={`rounded-2xl shadow-sm border ${theme.surface.card} ${theme.border.primary}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className={`divide-y ${theme.border.primary}`}>
            {menuItems.map((item, index) => (
              <motion.button
                key={item.id}
                className={`w-full flex items-center gap-4 p-4 hover:bg-tennis-court-50 dark:hover:bg-tennis-court-900/10 transition-colors first:rounded-t-2xl last:rounded-b-2xl ${
                  item.dangerous ? "hover:bg-status-error-50 dark:hover:bg-status-error-900/10" : ""
                }`}
                onClick={() => handleMenuClick(item)}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${item.color}`}
                >
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                  <h4 className={`font-semibold ${theme.text.primary}`}>
                    {item.title}
                  </h4>
                  <p className={`text-sm ${theme.text.secondary}`}>
                    {item.description}
                  </p>
                </div>
                <div className={theme.text.secondary}>
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* 회원탈퇴 확인 모달 */}
      {showDeleteModal && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={`w-full max-w-sm rounded-2xl p-6 ${theme.surface.card} ${theme.border.primary} border shadow-xl`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-status-error-100 dark:bg-status-error-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MdWarning className="w-8 h-8 text-status-error-600 dark:text-status-error-400" />
              </div>
              <h3 className={`text-lg font-bold mb-2 ${theme.text.primary}`}>
                정말 탈퇴하시겠습니까?
              </h3>
              <p className={`text-sm ${theme.text.secondary} mb-4`}>
                탈퇴하면 모든 데이터가 삭제되며 복구할 수 없습니다.
              </p>
              <div className={`p-3 rounded-lg bg-status-error-50 dark:bg-status-error-900/20 border ${theme.border.primary}`}>
                <p className={`text-xs ${theme.text.primary} font-medium`}>
                  삭제될 데이터:
                </p>
                <ul className={`text-xs ${theme.text.secondary} mt-1 space-y-1`}>
                  <li>• 프로필 정보 및 테니스 기록</li>
                  <li>• 매치 참가 내역</li>
                  <li>• 채팅 및 리뷰 데이터</li>
                  <li>• 모든 개인 설정</li>
                </ul>
              </div>
            </div>
            <div className="flex gap-3">
              <motion.button
                className={`flex-1 py-3 px-4 rounded-xl font-medium ${theme.surface.card} ${theme.text.primary} border ${theme.border.primary} transition-colors`}
                onClick={handleDeleteCancel}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                취소
              </motion.button>
              <motion.button
                className="flex-1 py-3 px-4 rounded-xl font-medium text-white bg-status-error-500 hover:bg-status-error-600 transition-colors"
                onClick={handleDeleteAccount}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                탈퇴하기
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SettingsPage;