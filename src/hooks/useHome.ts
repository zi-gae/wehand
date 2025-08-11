import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getWeHandTennisAPI } from "../api";

// Query Keys
export const homeQueryKeys = {
  all: ["home"] as const,
  data: () => [...homeQueryKeys.all, "data"] as const,
  upcomingMatches: () => [...homeQueryKeys.all, "upcoming-matches"] as const,
} as const;

// 홈 화면 데이터 조회 훅
export const useHomeData = () => {
  const api = getWeHandTennisAPI();

  return useQuery({
    queryKey: homeQueryKeys.data(),
    queryFn: () => api.getApiHome().then((response) => response.data),
    staleTime: 5 * 60 * 1000, // 5분
  });
};

// 홈 화면에서의 매치 참가 신청 훅
export const useJoinMatchFromHome = () => {
  const queryClient = useQueryClient();
  const api = getWeHandTennisAPI();

  return useMutation({
    mutationFn: ({ matchId, message }: { matchId: string; message?: string }) =>
      api
        .postApiMatchesMatchIdJoin(matchId, { message })
        .then((response) => response),
    onSuccess: () => {
      // 홈 데이터 리패치하여 최신 정보 반영
      queryClient.invalidateQueries({ queryKey: homeQueryKeys.data() });
    },
    onError: (error) => {
      console.error("매치 참가 신청 실패:", error);
    },
  });
};
