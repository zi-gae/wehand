import { useQuery } from '@tanstack/react-query';
import { getWeHandTennisAPI } from '../api';

// Query Keys
export const regionQueryKeys = {
  all: ['regions'] as const,
  data: () => [...regionQueryKeys.all, 'data'] as const,
} as const;

export const venueQueryKeys = {
  all: ['venues'] as const,
  list: (params?: Record<string, any>) => [...venueQueryKeys.all, 'list', params || {}] as const,
} as const;

// 지역 데이터 조회 훅
export const useRegions = () => {
  const api = getWeHandTennisAPI();
  
  return useQuery({
    queryKey: regionQueryKeys.data(),
    queryFn: () => api.getApiRegions().then(response => response.data),
    staleTime: 60 * 60 * 1000, // 1시간 (지역 데이터는 자주 변경되지 않음)
  });
};

// 테니스장 검색 훅
export const useVenues = (params?: {
  keyword?: string;
  region?: string;
  district?: string;
  page?: number;
  limit?: number;
}) => {
  const api = getWeHandTennisAPI();
  
  return useQuery({
    queryKey: venueQueryKeys.list(params),
    queryFn: () => api.getApiVenues({
      keyword: params?.keyword,
      region: params?.region,
      district: params?.district,
      page: params?.page,
      limit: params?.limit
    }).then(response => response.data),
    enabled: !!(params?.keyword || params?.region), // 검색어나 지역이 있을 때만 실행
    staleTime: 10 * 60 * 1000, // 10분
  });
};

// 근처 테니스장 조회 훅
export const useNearbyVenues = (params: {
  latitude: number;
  longitude: number;
  radius?: number;
  limit?: number;
}) => {
  const api = getWeHandTennisAPI();
  
  return useQuery({
    queryKey: [...venueQueryKeys.all, 'nearby', params],
    queryFn: () => api.getApiVenuesNearby(params).then(response => response.data),
    enabled: !!(params.latitude && params.longitude),
    staleTime: 5 * 60 * 1000, // 5분
  });
};

// 테니스장 상세 조회 훅
export const useVenue = (venueId: string) => {
  const api = getWeHandTennisAPI();
  
  return useQuery({
    queryKey: [...venueQueryKeys.all, 'detail', venueId],
    queryFn: () => api.getApiVenuesVenueId(venueId).then(response => response.data),
    enabled: !!venueId,
    staleTime: 10 * 60 * 1000, // 10분
  });
};

// 모든 테니스장 조회 훅
export const useAllVenues = () => {
  const api = getWeHandTennisAPI();
  
  return useQuery({
    queryKey: [...venueQueryKeys.all, 'all'],
    queryFn: () => api.getApiVenuesAll().then(response => response.data),
    staleTime: 30 * 60 * 1000, // 30분 (전체 데이터는 오래 캐시)
  });
};