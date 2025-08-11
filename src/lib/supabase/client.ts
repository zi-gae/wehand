import { createClient } from '@supabase/supabase-js';

// Supabase 클라이언트 생성 함수
export const createSupabaseClient = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL과 Anon Key가 환경변수에 설정되어 있지 않습니다.');
  }

  return createClient(supabaseUrl, supabaseKey);
};

// 기본 클라이언트 인스턴스
export const supabase = createSupabaseClient();