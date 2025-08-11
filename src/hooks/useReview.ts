import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getWeHandTennisAPI, SubmitReviewRequest } from "../api";

// Query keys
export const reviewQueryKeys = {
  all: ["reviews"] as const,
  reviewable: () => [...reviewQueryKeys.all, "reviewable"] as const,
  userReviews: (userId: string) =>
    [...reviewQueryKeys.all, "user", userId] as const,
  myReviews: () => [...reviewQueryKeys.all, "my"] as const,
} as const;

// 리뷰 가능한 매치 목록 조회
export const useReviewableMatches = () => {
  const api = getWeHandTennisAPI();

  return useQuery({
    queryKey: reviewQueryKeys.reviewable(),
    queryFn: () =>
      api.getApiReviewsReviewable().then((response) => response.data),
    staleTime: 1000 * 60 * 5, // 5분
  });
};

// 리뷰 제출
export const useSubmitReview = () => {
  const queryClient = useQueryClient();
  const api = getWeHandTennisAPI();

  return useMutation({
    mutationFn: ({
      matchId,
      ...payload
    }: { matchId: string } & SubmitReviewRequest) =>
      api
        .postApiReviewsMatchesMatchId(matchId, payload)
        .then((response) => response.data),
    onSuccess: () => {
      // 리뷰 가능한 매치 목록 새로고침
      queryClient.invalidateQueries({ queryKey: reviewQueryKeys.reviewable() });
    },
  });
};

// 사용자가 받은 리뷰 조회
export const useUserReviews = (userId: string) => {
  const api = getWeHandTennisAPI();

  return useQuery({
    queryKey: reviewQueryKeys.userReviews(userId),
    queryFn: () =>
      api.getApiReviewsUsersUserId(userId).then((response) => response.data),
    enabled: !!userId,
    staleTime: 1000 * 60 * 10, // 10분
  });
};

// 내가 받은 리뷰 조회
export const useMyReviews = (params?: { page?: number; limit?: number }) => {
  const api = getWeHandTennisAPI();

  return useQuery({
    queryKey: reviewQueryKeys.myReviews(),
    queryFn: () =>
      api.getApiProfileMyReviews(params).then((response) => response.data),
    staleTime: 1000 * 60 * 10, // 10분
  });
};
