import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";

interface NavItem {
  path: string;
  icon: string;
  label: string;
  isCreate?: boolean;
}

const navItems: NavItem[] = [
  { path: "/", icon: "🏠", label: "홈" },
  { path: "/matching", icon: "🤝", label: "매칭" },
  { path: "/create", icon: "➕", label: "생성", isCreate: true },
  { path: "/board", icon: "📋", label: "게시판" },
  { path: "/profile", icon: "👤", label: "프로필" },
];

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (path: string) => {
    navigate(path);
  };

  return (
    <motion.nav
      className="bottom-navigation"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="nav-container">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <motion.button
              key={item.path}
              className={`nav-item ${isActive ? "active" : ""}`}
              onClick={() => handleNavClick(item.path)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              animate={{
                scale: isActive ? 1.1 : 1,
                y: isActive ? -2 : 0,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  className="active-indicator"
                  layoutId="activeTab"
                  initial={false}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}

              {/* Special styling for create button */}
              {item.isCreate ? (
                <motion.div
                  className="create-icon-wrapper"
                  whileHover={{ rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="create-icon">{item.icon}</span>
                </motion.div>
              ) : (
                <motion.span
                  className="nav-icon"
                  animate={{
                    scale: isActive ? 1.2 : 1,
                    rotate: isActive ? [0, -10, 10, 0] : 0,
                  }}
                  transition={{
                    scale: { type: "spring", stiffness: 300, damping: 20 },
                    rotate: { duration: 0.5, ease: "easeInOut" },
                  }}
                >
                  {item.icon}
                </motion.span>
              )}

              <motion.span
                className="nav-label"
                animate={{
                  opacity: isActive ? 1 : 0.7,
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {item.label}
              </motion.span>
            </motion.button>
          );
        })}
      </div>
    </motion.nav>
  );
};

export default BottomNavigation;
