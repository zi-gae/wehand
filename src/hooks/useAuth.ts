import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { getWeHandTennisAPI, RefreshTokenRequest } from "../api";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Session } from "@supabase/supabase-js";

// 토큰 갱신 훅
export const useRefreshToken = () => {
  const api = getWeHandTennisAPI();

  return useMutation({
    mutationFn: (request: RefreshTokenRequest) =>
      api.postApiAuthRefresh(request).then((response) => response),
    onSuccess: (response) => {
      if (response?.data?.accessToken && response?.data?.refreshToken) {
        // 새로운 토큰으로 업데이트
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      console.log("토큰 갱신 성공:", response);
    },
    onError: (error) => {
      console.error("토큰 갱신 실패:", error);
      // 토큰 갱신 실패 시 로그아웃 처리
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    },
  });
};

// 현재 사용자 정보 조회 훅
export const useMe = () => {
  const api = getWeHandTennisAPI();

  return useQuery({
    queryKey: ["user", "me"],
    queryFn: () => api.getApiAuthMe().then((response) => response),
    staleTime: 5 * 60 * 1000, // 5분
    retry: false, // 인증 실패 시 재시도하지 않음
  });
};

// Suspense용 현재 사용자 정보 조회 훅
export const useGetApiAuthMeSuspense = () => {
  const api = getWeHandTennisAPI();
  return useSuspenseQuery({
    queryKey: ["user", "me"],
    queryFn: () => api.getApiAuthMe().then((response) => response.data),
    staleTime: 5 * 60 * 1000,
  });
};

// 로그아웃 훅
export const useLogout = () => {
  const queryClient = useQueryClient();
  const api = getWeHandTennisAPI();

  return useMutation({
    mutationFn: () => api.postApiAuthLogout().then((response) => response),
    onSuccess: () => {
      // 로컬 스토리지 정리
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      // 모든 쿼리 캐시 제거
      queryClient.clear();

      console.log("로그아웃 성공");
    },
    onError: (error) => {
      console.error("로그아웃 실패:", error);
    },
  });
};

export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    async function fetchSession() {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    }
    fetchSession();

    // 세션 변경 구독
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const accessToken = session?.access_token || null;
  const refreshToken = session?.refresh_token || null;
  const user = session?.user || null;
  const isAuthenticated = !!session;

  return { accessToken, refreshToken, user, isAuthenticated };
};
