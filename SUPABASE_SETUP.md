# WeHand Tennis - Supabase 설정 가이드

이 프로젝트는 Supabase를 사용하여 사용자 인증 및 데이터 처리를 수행합니다.

## 1. Supabase 프로젝트 생성

1. [Supabase Dashboard](https://supabase.com/dashboard)에 접속
2. "New project" 클릭
3. 프로젝트 정보 입력:
   - Name: `wehand-tennis`
   - Database Password: 안전한 비밀번호 설정
   - Region: 가까운 지역 선택

## 2. 환경 변수 설정

`.env.local` 파일에 Supabase 정보를 추가하세요:

```bash
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Supabase URL과 Key 찾는 방법:
1. Supabase Dashboard → 프로젝트 선택
2. Settings → API
3. Project URL과 anon public key 복사

## 3. Supabase Edge Functions 배포

### 3.1 Supabase CLI 설치
```bash
npm install -g supabase
```

### 3.2 프로젝트 연결
```bash
supabase login
supabase link --project-ref your-project-ref
```

### 3.3 hyper-responder Function 배포
```bash
supabase functions deploy hyper-responder
```

## 4. 데이터베이스 스키마 (필요시)

사용자 정보를 저장할 테이블이 필요한 경우:

```sql
-- users 테이블 생성
CREATE TABLE public.users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR NOT NULL,
  profile_image VARCHAR,
  provider VARCHAR NOT NULL,
  role VARCHAR DEFAULT 'member',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) 활성화
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 데이터만 조회 가능
CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT USING (auth.uid()::text = id::text);
```

## 5. 테스트

개발 환경에서는 MSW(Mock Service Worker)가 hyper-responder 함수를 모킹합니다. 실제 Supabase 함수를 테스트하려면:

1. `.env.local`에 실제 Supabase 정보 입력
2. `npm run dev`로 개발 서버 실행
3. 카카오 로그인 테스트

## 6. hyper-responder Function 기능

이 함수는 사용자 로그인 시 다음 작업을 수행할 수 있습니다:

- ✅ 사용자 데이터 처리 및 로깅
- 🔄 데이터베이스에 사용자 정보 저장/업데이트
- 📧 신규 사용자 환영 이메일 발송
- 📊 사용자 활동 분석 데이터 수집
- 🔗 외부 서비스와 연동

현재는 기본 로깅만 구현되어 있으며, 필요에 따라 추가 기능을 구현할 수 있습니다.

## 7. 프로덕션 배포

프로덕션 환경에서는:
1. 환경변수에 실제 Supabase 정보 설정
2. Edge Functions가 정상적으로 배포되었는지 확인
3. RLS 정책이 적절히 설정되었는지 검토