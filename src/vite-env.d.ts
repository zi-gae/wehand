/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_KAKAO_JAVASCRIPT_KEY: string
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  // 다른 환경 변수들도 여기에 추가
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}