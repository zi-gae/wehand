import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getWeHandTennisAPI, UpdateProfileRequest } from "../api";

// Query Keys
export const profileQueryKeys = {
  all: ["profile"] as const,
  data: () => [...profileQueryKeys.all, "data"] as const,
  matches: (params?: Record<string, any>) =>
    [...profileQueryKeys.all, "matches", params || {}] as const,
} as const;

// 프로필 정보 조회 훅 (Suspense)
export const useProfile = () => {
  const api = getWeHandTennisAPI();

  return useQuery({
    queryKey: profileQueryKeys.data(),
    queryFn: () => api.getApiProfileMe().then((response) => response.data),
    staleTime: 10 * 60 * 1000, // 10분
  });
};

// 프로필 수정 훅
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const api = getWeHandTennisAPI();

  return useMutation({
    mutationFn: (profileData: UpdateProfileRequest) =>
      api.putApiProfileMe(profileData).then((response) => response),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueryKeys.data() });
    },
  });
};

// 경기 기록 조회 훅
export const useMatchHistory = (params?: {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
}) => {
  const api = getWeHandTennisAPI();

  return useQuery({
    queryKey: profileQueryKeys.matches(params),
    queryFn: () =>
      api
        .getApiProfileMyMatches({
          page: params?.page,
          limit: params?.limit,
          status: params?.status as any,
          type: params?.type as any,
        })
        .then((response) => response.data),
    staleTime: 5 * 60 * 1000,
  });
};

// 내가 받은 리뷰 조회 훅
export const useMyReviews = (params?: { page?: number; limit?: number }) => {
  const api = getWeHandTennisAPI();

  return useQuery({
    queryKey: [...profileQueryKeys.all, "reviews", params || {}],
    queryFn: () =>
      api.getApiProfileMyReviews(params).then((response) => response.data),
    staleTime: 5 * 60 * 1000,
  });
};

// 북마크한 매치 조회 훅
export const useBookmarks = (params?: { page?: number; limit?: number }) => {
  const api = getWeHandTennisAPI();

  return useQuery({
    queryKey: [...profileQueryKeys.all, "bookmarks", params || {}],
    queryFn: () =>
      api.getApiProfileBookmarks(params).then((response) => response.data),
    staleTime: 5 * 60 * 1000,
  });
};

// 다른 사용자 프로필 조회 훅
export const useUserProfile = (userId: string) => {
  const api = getWeHandTennisAPI();

  return useQuery({
    queryKey: [...profileQueryKeys.all, "user", userId],
    queryFn: () =>
      api.getApiProfileUsersUserId(userId).then((response) => response.data),
    enabled: !!userId,
    staleTime: 10 * 60 * 1000,
  });
};
