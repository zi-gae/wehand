import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import {
  MdHome,
  MdAdd,
  MdForum,
  MdPerson,
  MdSportsTennis,
  MdChat,
} from "react-icons/md";
import { getThemeClasses, tennisGradients } from "../lib/theme";

interface NavItem {
  path: string;
  icon: any;
  label: string;
  isCreate?: boolean;
}

const navItems: NavItem[] = [
  { path: "/", icon: MdHome, label: "홈" },
  { path: "/matching", icon: MdSportsTennis, label: "매칭" },
  { path: "/create", icon: MdAdd, label: "생성", isCreate: true },
  { path: "/board", icon: MdChat, label: "게시판" },
  { path: "/profile", icon: MdPerson, label: "프로필" },
];

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = getThemeClasses();
  
  // iOS 감지 (PWA 모드 포함)
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) || // iPad Pro
    (window.matchMedia('(display-mode: standalone)').matches && /Safari/.test(navigator.userAgent)) || // PWA on iOS
    ('standalone' in navigator && (navigator as any).standalone === true); // iOS PWA standalone mode

  const handleNavClick = (path: string) => {
    navigate(path);
  };

  // 생성 관련 경로인지 확인하는 함수
  const isCreateRelated = (pathname: string) => {
    return pathname.startsWith("/create");
  };

  // 바텀 네비게이션을 숨길 페이지들
  const hideBottomNavRoutes = [
    "/signup",
    "/auth/kakao/callback",
    "/terms",
    "/privacy",
  ];

  // 현재 페이지가 바텀 네비게이션을 숨겨야 하는 페이지인지 확인
  const shouldHideBottomNav = hideBottomNavRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  // 바텀 네비게이션을 숨겨야 하는 경우 null 반환
  if (shouldHideBottomNav) {
    return null;
  }

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-50 shadow-lg transition-all duration-300 ${theme.surface.glassCard}`}
      style={{
        willChange: "transform",
        contain: "layout style paint",
        transform: "translateZ(0)", // GPU 가속 강제 적용
        backfaceVisibility: "hidden", // 렌더링 최적화
        paddingBottom: "env(safe-area-inset-bottom)",
        height: isIOS ? "calc(6rem + env(safe-area-inset-bottom))" : "calc(5rem + env(safe-area-inset-bottom))",
      }}
    >
      <div className="flex justify-around items-center px-4 py-2 max-w-md mx-auto h-20">
        {navItems.map((item) => {
          // 생성 버튼의 경우 /create로 시작하는 모든 경로에서 활성화
          const isActive = item.isCreate
            ? isCreateRelated(location.pathname)
            : location.pathname === item.path;

          return (
            <motion.button
              key={item.path}
              className={`relative flex flex-col items-center justify-center p-1 w-16 h-16 flex-shrink-0`}
              onClick={() => handleNavClick(item.path)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              style={{
                willChange: "transform",
                contain: "layout",
              }}
            >
              {/* Active background */}
              {isActive && (
                <motion.div
                  className="absolute inset-1 bg-gradient-to-br from-primary-500/20 to-tennis-lime-500/20 rounded-2xl"
                  layoutId="activeBackground"
                  initial={false}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  style={{ contain: "layout style paint" }}
                />
              )}

              {/* Special styling for create button */}
              {item.isCreate ? (
                <motion.div
                  className={`z-10 w-14 h-14 rounded-full flex items-center justify-center text-lg ${tennisGradients.primary} text-white shadow-xl`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  animate={{
                    boxShadow: [
                      "0 8px 25px rgba(34, 197, 94, 0.5)",
                      "0 12px 30px rgba(34, 197, 94, 0.5)",
                      "0 8px 25px rgba(34, 197, 94, 0.5)",
                    ],
                  }}
                  style={{
                    contain: "layout style paint",
                  }}
                >
                  <item.icon className="w-7 h-7" />
                </motion.div>
              ) : (
                <motion.div
                  className="relative z-10 w-8 h-8 flex items-center justify-center text-xl"
                  animate={{
                    scale: isActive ? 1.15 : 1,
                    y: isActive ? -1 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  style={{ contain: "layout style paint" }}
                >
                  <motion.span
                    className={`${
                      isActive ? theme.text.tennis : theme.text.secondary
                    }`}
                    animate={
                      isActive
                        ? {
                            rotate: [0, -10, 10, -5, 5, 0],
                            scale: [1, 1.1, 1],
                          }
                        : {}
                    }
                    transition={{
                      rotate: { duration: 0.6, ease: "easeInOut" },
                      scale: { duration: 0.3, ease: "easeInOut" },
                    }}
                  >
                    <item.icon className="w-6 h-6" />
                  </motion.span>
                </motion.div>
              )}

              <motion.span
                className={`relative z-10 text-xs mt-0.5 font-medium ${
                  isActive ? theme.text.tennis : theme.text.secondary
                } ${item.isCreate ? "hidden" : ""}`}
                animate={{
                  opacity: isActive ? 1 : 0.7,
                  y: isActive ? -0.5 : 0,
                }}
                transition={{ duration: 0.2 }}
                style={{ contain: "layout style paint" }}
              >
                {item.label}
              </motion.span>

              {/* Active dot indicator */}
              {isActive && !item.isCreate && (
                <motion.div
                  className={`absolute top-0 w-2 h-2 ${tennisGradients.primary} rounded-full`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  style={{ contain: "layout style paint" }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
