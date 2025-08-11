import { motion, AnimatePresence } from "framer-motion";
import { useEffect, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getThemeClasses } from "../lib/theme";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  hashRoute?: string; // 해시 라우트 (예: "#filter")
  size?: "full" | "half"; // 바텀시트 크기
}

const BottomSheet = ({
  isOpen,
  onClose,
  children,
  hashRoute = "#modal",
  size = "full",
}: BottomSheetProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = getThemeClasses();

  useEffect(() => {
    if (isOpen) {
      // 바텀시트가 열릴 때
      // 1. 뒷배경 스크롤 방지 - 더 강력한 방법
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";

      // 2. 해시 추가 (현재 해시가 없거나 다른 해시인 경우만)
      if (location.hash !== hashRoute) {
        navigate(location.pathname + location.search + hashRoute, {
          replace: false,
        });
      }
    } else {
      // 바텀시트가 닫힐 때
      // 1. 스크롤 복구
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }

      // 2. 해시 제거 (현재 해시가 우리가 설정한 것인 경우만)
      if (location.hash === hashRoute) {
        navigate(location.pathname + location.search, { replace: false });
      }
    }

    return () => {
      // 컴포넌트 언마운트 시 스크롤 복구
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
    };
  }, [isOpen, hashRoute, navigate, location]);

  // 뒤로가기 감지
  useEffect(() => {
    const handlePopState = () => {
      if (isOpen && location.hash !== hashRoute) {
        onClose();
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isOpen, onClose, hashRoute, location.hash]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Bottom Sheet */}
          <motion.div
            className={`fixed bottom-20 left-0 right-0 ${theme.surface.card} rounded-t-3xl z-50 overflow-y-auto shadow-2xl border-t border-l border-r ${theme.border.primary} ${
              size === "half" ? "h-[50vh]" : "h-[80vh]"
            }`}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{
              y: "100%",
              transition: { duration: 0.2, ease: "easeInOut" },
            }}
            transition={{
              duration: 0.2,
              ease: "easeInOut",
            }}
          >
            <div className="flex flex-col h-full">
              {/* Handle Bar */}
              <div className="flex justify-center py-3">
                <div className={`w-12 h-1 ${theme.text.secondary === 'text-gray-600' ? 'bg-gray-300' : 'bg-gray-600'} rounded-full`}></div>
              </div>

              {/* Content */}
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BottomSheet;
