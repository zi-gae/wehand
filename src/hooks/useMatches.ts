import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  useSuspenseQuery,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import {
  getWeHandTennisAPI,
  CreateMatchRequest,
  GetApiMatchesSort,
  JoinMatchRequest,
} from "../api";

// Query Keys
export const matchQueryKeys = {
  all: ["matches"] as const,
  lists: () => [...matchQueryKeys.all, "list"] as const,
  list: (filters: Record<string, any>) =>
    [...matchQueryKeys.lists(), filters] as const,
  details: () => [...matchQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...matchQueryKeys.details(), id] as const,
} as const;

// 매치 목록 조회 훅
export const useMatches = (params?: {
  search?: string;
  region?: string;
  gameType?: string;
  date?: string;
  timeSlots?: string;
  ntrpMin?: number;
  ntrpMax?: number;
  experienceMin?: number;
  experienceMax?: number;
  sort?: GetApiMatchesSort;
  latitude?: number;
  longitude?: number;
}) => {
  const api = getWeHandTennisAPI();

  return useQuery({
    queryKey: matchQueryKeys.list(params || {}),
    queryFn: () =>
      api
        .getApiMatches({
          search: params?.search,
          region: params?.region,
          game_type: params?.gameType as any,
          date: params?.date,
          ntrp_min: params?.ntrpMin,
          ntrp_max: params?.ntrpMax,
          experience_min: params?.experienceMin,
          experience_max: params?.experienceMax,
          sort: params?.sort,
          user_lat: params?.latitude,
          user_lng: params?.longitude,
        })
        .then((response) => response.data),
    staleTime: 3 * 60 * 1000, // 3분
  });
};

// 무한 스크롤을 위한 매치 목록 훅
export const useInfiniteMatches = (params?: {
  search?: string;
  region?: string;
  gameType?: string;
  date?: string;
  timeSlots?: string;
  ntrpMin?: number;
  ntrpMax?: number;
  experienceMin?: number;
  experienceMax?: number;
  sort?: GetApiMatchesSort;
  latitude?: number;
  longitude?: number;
}) => {
  const api = getWeHandTennisAPI();

  return useInfiniteQuery({
    queryKey: matchQueryKeys.list(params || {}),
    queryFn: ({ pageParam = 1 }) =>
      api
        .getApiMatches({
          search: params?.search,
          region: params?.region,
          game_type: params?.gameType as any,
          date: params?.date,
          ntrp_min: params?.ntrpMin,
          ntrp_max: params?.ntrpMax,
          experience_min: params?.experienceMin,
          experience_max: params?.experienceMax,
          sort: params?.sort,
          user_lat: params?.latitude,
          user_lng: params?.longitude,
          page: pageParam,
          limit: 10,
        })
        .then((response) => response.data || []), // Match[] 반환
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      // 현재 페이지의 매치 개수를 확인
      const currentPageCount = lastPage?.length || 0;

      // 페이지당 10개씩 로드하므로, 10개 미만이면 마지막 페이지
      if (currentPageCount === 10) {
        return lastPageParam + 1;
      }
      return undefined;
    },
    staleTime: 3 * 60 * 1000,
  });
};

// 매치 상세 정보 조회 훅
export const useMatch = (matchId: string) => {
  const api = getWeHandTennisAPI();

  return useQuery({
    queryKey: matchQueryKeys.detail(matchId),
    queryFn: () =>
      api.getApiMatchesMatchId(matchId).then((response) => response.data),
    enabled: !!matchId,
    staleTime: 5 * 60 * 1000,
  });
};


// 매치 참가 신청 훅
export const useJoinMatch = () => {
  const queryClient = useQueryClient();
  const api = getWeHandTennisAPI();

  return useMutation({
    mutationFn: ({ matchId, message }: { matchId: string; message?: string }) =>
      api
        .postApiMatchesMatchIdJoin(matchId, { message })
        .then((response) => response),
    onSuccess: (data, variables) => {
      // 매치 상세 정보 업데이트
      queryClient.invalidateQueries({
        queryKey: matchQueryKeys.detail(variables.matchId),
      });
      // 매치 목록도 업데이트
      queryClient.invalidateQueries({
        queryKey: matchQueryKeys.lists(),
      });
    },
  });
};

// 매치 북마크 훅
export const useBookmarkMatch = () => {
  const queryClient = useQueryClient();
  const api = getWeHandTennisAPI();

  return useMutation({
    mutationFn: (matchId: string) =>
      api.postApiMatchesMatchIdBookmark(matchId).then((response) => response),
    onSuccess: (data, matchId) => {
      queryClient.invalidateQueries({
        queryKey: matchQueryKeys.detail(matchId),
      });
    },
  });
};

// 매치 북마크 해제 훅
export const useUnbookmarkMatch = () => {
  const queryClient = useQueryClient();
  const api = getWeHandTennisAPI();

  return useMutation({
    mutationFn: (matchId: string) =>
      api.deleteApiMatchesMatchIdBookmark(matchId).then((response) => response),
    onSuccess: (data, matchId) => {
      queryClient.invalidateQueries({
        queryKey: matchQueryKeys.detail(matchId),
      });
    },
  });
};

// 매치 공유 훅
export const useShareMatch = () => {
  const api = getWeHandTennisAPI();

  return useMutation({
    mutationFn: (matchId: string) =>
      api.postApiMatchesMatchIdShare(matchId).then((response) => response.data),
    onSuccess: (data) => {
      // 공유 성공 시 처리 (토스트 메시지 등)
      console.log("매치 공유:", data);
    },
  });
};

// 매치 생성 훅
export const useCreateMatch = () => {
  const queryClient = useQueryClient();
  const api = getWeHandTennisAPI();

  return useMutation({
    mutationFn: (matchData: CreateMatchRequest) =>
      api.postApiMatches(matchData).then((response) => response.data),
    onSuccess: () => {
      // 매치 목록 새로고침
      queryClient.invalidateQueries({ queryKey: matchQueryKeys.lists() });
    },
  });
};

// Suspense를 위한 무한 스크롤 매치 목록 훅
export const useSuspenseInfiniteMatches = (params?: {
  search?: string;
  region?: string;
  gameType?: string;
  date?: string;
  timeSlots?: string;
  ntrpMin?: number;
  ntrpMax?: number;
  experienceMin?: number;
  experienceMax?: number;
  sort?: GetApiMatchesSort;
  latitude?: number;
  longitude?: number;
}) => {
  const api = getWeHandTennisAPI();

  return useSuspenseInfiniteQuery({
    queryKey: matchQueryKeys.list(params || {}),
    queryFn: ({ pageParam = 1 }) =>
      api
        .getApiMatches({
          search: params?.search,
          region: params?.region,
          game_type: params?.gameType as any,
          date: params?.date,
          ntrp_min: params?.ntrpMin,
          ntrp_max: params?.ntrpMax,
          experience_min: params?.experienceMin,
          experience_max: params?.experienceMax,
          sort: params?.sort,
          user_lat: params?.latitude,
          user_lng: params?.longitude,
          page: pageParam,
          limit: 10,
        })
        .then((response) => response.data || []), // Match[] 반환
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      // 현재 페이지의 매치 개수를 확인
      const currentPageCount = lastPage?.length || 0;

      // 페이지당 10개씩 로드하므로, 10개 미만이면 마지막 페이지
      if (currentPageCount === 10) {
        return lastPageParam + 1;
      }
      return undefined;
    },
    staleTime: 3 * 60 * 1000,
  });
};

// Suspense를 위한 매치 상세 정보 조회 훅
export const useSuspenseMatch = (matchId: string) => {
  const api = getWeHandTennisAPI();

  return useSuspenseQuery({
    queryKey: matchQueryKeys.detail(matchId),
    queryFn: () =>
      api.getApiMatchesMatchId(matchId).then((response) => response.data),
    staleTime: 5 * 60 * 1000,
  });
};

// 매치 참가 신청 훅 (POST API용)
export const usePostApiMatchesMatchIdJoin = () => {
  const queryClient = useQueryClient();
  const api = getWeHandTennisAPI();
  return useMutation({
    mutationFn: ({
      matchId,
      data,
    }: {
      matchId: string;
      data: JoinMatchRequest;
    }) =>
      api.postApiMatchesMatchIdJoin(matchId, data).then((response) => response),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: matchQueryKeys.detail(variables.matchId),
      });
    },
  });
};

// 매치 채팅방 생성 훅
export const useCreateMatchChat = () => {
  const queryClient = useQueryClient();
  const api = getWeHandTennisAPI();

  return useMutation({
    mutationFn: (matchId: string) =>
      api.postApiMatchesMatchIdChat(matchId).then((response) => response.data),
    onSuccess: () => {
      // 채팅방 목록 업데이트
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
};

// 매치 1:1 채팅방 생성 훅
export const useCreatePrivateChat = () => {
  const queryClient = useQueryClient();
  const api = getWeHandTennisAPI();

  return useMutation({
    mutationFn: (matchId: string) =>
      api
        .postApiMatchesMatchIdChatPrivate(matchId)
        .then((response) => response.data),
    onSuccess: () => {
      // 채팅방 목록 업데이트
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
};
