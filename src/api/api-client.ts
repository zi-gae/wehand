import { BASE_URL } from "@/constants/env";
import { logger } from "@/lib/logger";
import axios, { AxiosRequestConfig } from "axios";

// API 베이스 URL 설정 - 환경변수로만 관리

// Axios 인스턴스 생성
export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request 인터셉터 - 인증 토큰 추가
apiClient.interceptors.request.use(
  (config) => {
    // 로깅 API 호출은 인터셉터 로깅 건너뛰기 (무한 루프 방지)
    const isLoggingCall = config.url?.includes('/logs/client');
    
    const key = `sb-cylkhqezhacwheqlstvf-auth-token`;
    const storage = localStorage.getItem(key);

    // 로깅 API가 아닌 경우에만 로그 기록
    if (!isLoggingCall) {
      logger.webview("웹뷰: API 요청 인터셉터", { 
        url: config.url,
        hasToken: !!storage 
      });
    }

    if (storage) {
      try {
        const parsedToken = JSON.parse(storage);
        const accessToken = parsedToken?.access_token;
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      } catch (error) {
        console.error("Token parsing error:", error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response 인터셉터 - 에러 처리 및 토큰 갱신
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 401 에러 처리 (토큰 만료 등)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 토큰 갱신 로직 (필요시 구현)
        // const refreshToken = localStorage.getItem('refresh_token');
        // await refreshAuthToken(refreshToken);
        // 원래 요청 재시도
        // return apiClient(originalRequest);
      } catch (refreshError) {
        // 토큰 갱신 실패 시 로그인 페이지로 리다이렉트
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Orval에서 사용할 커스텀 Axios 인스턴스
export const customAxiosInstance = <T = any>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig
): Promise<T> => {
  const source = axios.CancelToken.source();
  const promise = apiClient({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }) => data);

  // @ts-ignore
  promise.cancel = () => {
    source.cancel("Query was cancelled");
  };

  return promise;
};

export default apiClient;
