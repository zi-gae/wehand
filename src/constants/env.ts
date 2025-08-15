export const BASE_URL = import.meta.env.VITE_API_URL;

// iOS/Android 모바일 앱에서의 OAuth 리다이렉트 URL 처리
export const getOAuthRedirectUrl = (path: string) => {
  // 모바일 앱 환경 감지
  const isMobileApp = window.location.protocol === 'capacitor:' || 
                     window.location.protocol === 'file:' ||
                     window.location.protocol === 'http:' && window.location.hostname === 'localhost' ||
                     (window.navigator as any)?.standalone ||
                     // Android WebView 감지
                     /Android.*wv/.test(navigator.userAgent);
  
  if (isMobileApp) {
    // 모바일 앱(iOS/Android)에서는 웹 도메인으로 리다이렉트
    return `https://wehand.zigae.com${path}`;
  }
  
  // 웹에서는 현재 origin 사용
  return `${window.location.origin}${path}`;
};
