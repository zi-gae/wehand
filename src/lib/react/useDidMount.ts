import React from "react";

export function useDidMount(callback: () => void) {
  React.useEffect(() => {
    callback();
  }, []); // 빈 의존성 배열로 컴포넌트가 마운트될 때만 실행
}
