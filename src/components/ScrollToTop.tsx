import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// ScrollToTop 컴포넌트 - 라우트 변경 시 스크롤을 최상단으로 이동
export const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
};
