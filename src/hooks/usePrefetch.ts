import { useQueryClient } from "@tanstack/react-query";
import { getWeHandTennisAPI } from "../api";
import { homeQueryKeys } from "./useHome";
import { matchQueryKeys } from "./useMatches";
import { profileQueryKeys } from "./useProfile";
import { notificationQueryKeys } from "./useNotifications";

export const usePrefetch = () => {
  const queryClient = useQueryClient();
  const api = getWeHandTennisAPI();

  const prefetchEssentialData = async () => {
    const prefetchPromises = [];

    // 1. 홈 데이터 prefetch (가장 중요)
    prefetchPromises.push(
      queryClient.prefetchQuery({
        queryKey: homeQueryKeys.data(),
        queryFn: () => api.getApiHome().then((response) => response.data),
        staleTime: 5 * 60 * 1000, // 5분
      })
    );

    // 2. 기본 매치 목록 prefetch
    prefetchPromises.push(
      queryClient.prefetchQuery({
        queryKey: matchQueryKeys.list({}),
        queryFn: () => api.getApiMatches().then((response) => response.data),
        staleTime: 3 * 60 * 1000, // 3분
      })
    );

    // 3. 프로필 데이터 prefetch
    prefetchPromises.push(
      queryClient.prefetchQuery({
        queryKey: profileQueryKeys.data(),
        queryFn: () => api.getApiProfileMe().then((response) => response.data),
        staleTime: 10 * 60 * 1000, // 10분
      })
    );

    // 4. 알림 데이터 prefetch
    prefetchPromises.push(
      queryClient.prefetchQuery({
        queryKey: notificationQueryKeys.list({}),
        queryFn: () =>
          api.getApiNotifications().then((response) => response.data),
        staleTime: 2 * 60 * 1000, // 2분
      })
    );

    try {
      await Promise.allSettled(prefetchPromises);
      console.log("✅ Essential data prefetched successfully");
    } catch (error) {
      console.log("⚠️ Some prefetch operations failed:", error);
    }
  };

  const prefetchSecondaryData = async () => {
    const prefetchPromises = [];

    // 6. 추가 커뮤니티 데이터 prefetch
    prefetchPromises.push(
      queryClient.prefetchQuery({
        queryKey: ["posts", "list", { category: "free" }],
        queryFn: () =>
          api
            .getApiCommunityPosts({ category: "free" })
            .then((response) => response.data),
        staleTime: 5 * 60 * 1000,
      })
    );

    try {
      await Promise.allSettled(prefetchPromises);
      console.log("✅ Secondary data prefetched successfully");
    } catch (error) {
      console.log("⚠️ Some secondary prefetch operations failed:", error);
    }
  };

  const prefetchUserSpecificData = async () => {
    const prefetchPromises = [];

    // 7. 사용자 매치 기록
    prefetchPromises.push(
      queryClient.prefetchQuery({
        queryKey: profileQueryKeys.matches({}),
        queryFn: () =>
          api.getApiProfileMyMatches().then((response) => response.data),
        staleTime: 10 * 60 * 1000,
      })
    );

    // 8. 사용자 리뷰 데이터
    prefetchPromises.push(
      queryClient.prefetchQuery({
        queryKey: [...profileQueryKeys.all, "reviews", {}],
        queryFn: () =>
          api.getApiProfileMyReviews().then((response) => response.data),
        staleTime: 10 * 60 * 1000,
      })
    );

    // 9. 북마크한 매치
    prefetchPromises.push(
      queryClient.prefetchQuery({
        queryKey: [...profileQueryKeys.all, "bookmarks", {}],
        queryFn: () =>
          api.getApiProfileBookmarks().then((response) => response.data),
        staleTime: 10 * 60 * 1000,
      })
    );

    // 10. 채팅방 목록
    prefetchPromises.push(
      queryClient.prefetchQuery({
        queryKey: ["chats", "rooms"],
        queryFn: () => api.getApiChatRooms().then((response) => response.data),
        staleTime: 5 * 60 * 1000,
      })
    );

    // 11. 알림 설정
    prefetchPromises.push(
      queryClient.prefetchQuery({
        queryKey: ["notifications", "settings"],
        queryFn: () =>
          api.getApiNotificationsSettings().then((response) => response.data),
        staleTime: 10 * 60 * 1000,
      })
    );

    // 12. 지역 데이터
    prefetchPromises.push(
      queryClient.prefetchQuery({
        queryKey: ["regions", "data"],
        queryFn: () => api.getApiRegions().then((response) => response.data),
        staleTime: 60 * 60 * 1000, // 1시간
      })
    );

    try {
      await Promise.allSettled(prefetchPromises);
      console.log("✅ User-specific data prefetched successfully");
    } catch (error) {
      console.log("⚠️ Some user-specific prefetch operations failed:", error);
    }
  };

  return {
    prefetchEssentialData,
    prefetchSecondaryData,
    prefetchUserSpecificData,
  };
};

export default usePrefetch;
