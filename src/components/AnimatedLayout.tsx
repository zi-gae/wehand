import { motion } from "framer-motion";
import { useLocation, useNavigationType } from "react-router-dom";
import { useRef, useMemo } from "react";

interface AnimatedLayoutProps {
  children: React.ReactNode;
}

// 페이지 전환 애니메이션 설정
const pageVariants = {
  initial: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  in: {
    x: 0,
    opacity: 1,
  },
  out: (direction: number) => ({
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
  }),
};

// 경로 깊이 계산
const getPathDepth = (pathname: string) =>
  pathname.split("/").filter(Boolean).length;

const AnimatedLayout = ({ children }: AnimatedLayoutProps) => {
  const location = useLocation();
  const navType = useNavigationType();
  const prevDepthRef = useRef(getPathDepth(location.pathname));

  // 애니메이션 방향 결정
  const direction = useMemo(() => {
    const currentDepth = getPathDepth(location.pathname);
    let dir = 1;

    if (navType === "POP") {
      dir = -1;
    } else if (currentDepth < prevDepthRef.current) {
      dir = -1;
    }

    prevDepthRef.current = currentDepth;
    return dir;
  }, [location.pathname, navType]);

  // location.key 대신 pathname 사용하여 불필요한 리렌더링 방지
  const pageKey = location.pathname;

  return (
    <motion.div
      key={pageKey}
      custom={direction}
      variants={pageVariants}
      initial="initial"
      animate="in"
      exit="out"
      transition={{
        type: "spring" as const,
        damping: 30,
        stiffness: 300,
        mass: 0.5,
      }}
      className="w-full min-h-screen"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        willChange: "transform, opacity",
      }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedLayout;
