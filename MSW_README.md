# MSW (Mock Service Worker) 설정 가이드

이 프로젝트는 MSW를 사용하여 API 호출을 모킹합니다. 실제 백엔드 서버 없이도 프론트엔드 개발을 진행할 수 있습니다.

## 📁 파일 구조

```
src/
├── mocks/
│   ├── browser.ts      # 브라우저용 MSW 설정
│   ├── node.ts         # Node.js용 MSW 설정 (테스트용)
│   ├── handlers.ts     # API 핸들러들
│   └── data.ts         # 목 데이터
├── api/
│   ├── index.ts        # API 클라이언트 함수들
│   └── usage-example.ts # API 사용 예제
└── main.tsx           # MSW 초기화 코드 포함
```

## 🚀 설정 및 사용

### 1. MSW 자동 시작

개발 환경에서 애플리케이션을 시작하면 MSW가 자동으로 활성화됩니다.

```bash
npm run dev
```

브라우저 개발자 도구 콘솔에서 다음 메시지를 확인할 수 있습니다:
```
[MSW] Mocking enabled.
```

### 2. API 호출 방법

`src/api/index.ts`에서 제공하는 API 함수들을 사용하세요:

```typescript
import { homeApi, matchesApi, postsApi } from './api';

// 홈 데이터 가져오기
const homeData = await homeApi.getHomeData();

// 매치 목록 가져오기 (필터링 포함)
const matches = await matchesApi.getMatches({
  search: '단식',
  region: '서울시 강남구',
  gameType: '단식',
  sort: 'latest'
});

// 특정 매치 상세 정보
const matchDetail = await matchesApi.getMatch(1);

// 매치 참가 신청
const joinResult = await matchesApi.joinMatch(1, '참가 신청 메시지');
```

### 3. 사용 가능한 API 엔드포인트

#### 🏠 Home API
- `GET /home` - 홈 화면 데이터 조회

#### 🎾 Matches API
- `GET /matches` - 매치 목록 조회 (필터링/검색/정렬)
- `GET /matches/:id` - 매치 상세 정보
- `POST /matches/:id/join` - 매치 참가 신청
- `POST /matches/:id/share` - 매치 공유
- `POST /matches/:id/bookmark` - 매치 북마크
- `DELETE /matches/:id/bookmark` - 매치 북마크 해제
- `POST /matches` - 새 매치 생성

#### 🌍 Regions & Venues API
- `GET /regions` - 지역 데이터 조회
- `GET /venues` - 테니스장 검색

#### 📝 Posts API
- `GET /posts` - 게시글 목록 조회
- `GET /posts/:id` - 게시글 상세 조회
- `POST /posts` - 새 게시글 작성
- `POST /posts/:id/like` - 게시글 좋아요
- `DELETE /posts/:id/like` - 게시글 좋아요 해제
- `POST /posts/:id/comments` - 댓글 작성
- `POST /comments/:id/like` - 댓글 좋아요

#### 👤 Profile API
- `GET /profile` - 프로필 정보 조회
- `PUT /profile` - 프로필 수정
- `GET /profile/matches` - 경기 기록 조회

#### 🔔 Notifications API
- `GET /notifications` - 알림 목록 조회
- `POST /notifications/:id/read` - 알림 읽음 처리
- `POST /notifications/read-all` - 모든 알림 읽음 처리

#### 💬 Chat API
- `GET /chats` - 채팅방 목록 조회
- `GET /chats/:id` - 채팅방 정보 및 메시지 조회
- `POST /chats/:id/messages` - 메시지 전송

#### 🔐 Auth API
- `POST /auth/login` - 로그인
- `POST /auth/refresh` - 토큰 갱신
- `POST /auth/logout` - 로그아웃

## 📊 목 데이터

`src/mocks/data.ts`에는 다음 데이터들이 포함되어 있습니다:

- **홈 데이터**: 사용자 정보, 예정된 매치
- **매치 데이터**: 다양한 상태의 테니스 매치들
- **지역 데이터**: 서울시, 경기도, 인천시 지역 정보
- **테니스장 데이터**: 주요 테니스장 정보
- **게시글 데이터**: 테니스 관련 게시글과 댓글
- **프로필 데이터**: 사용자 프로필, 통계, 리뷰
- **알림 데이터**: 다양한 유형의 알림
- **채팅 데이터**: 채팅방과 메시지

## 🔧 커스터마이징

### 새로운 API 핸들러 추가

1. `src/mocks/handlers.ts`에 새 핸들러 추가:

```typescript
http.get(`${BASE_URL}/new-endpoint`, () => {
  return HttpResponse.json({ data: 'your data' });
})
```

2. `src/mocks/data.ts`에 필요한 목 데이터 추가

3. `src/api/index.ts`에 API 함수 추가:

```typescript
export const newApi = {
  getData: () => apiRequest('/new-endpoint')
};
```

### 데이터 수정

`src/mocks/data.ts`에서 목 데이터를 원하는 대로 수정할 수 있습니다.

### 에러 시뮬레이션

특정 조건에서 에러를 시뮬레이션하려면:

```typescript
http.get(`${BASE_URL}/error-endpoint`, () => {
  // 50% 확률로 에러 반환
  if (Math.random() > 0.5) {
    return new HttpResponse(null, { status: 500 });
  }
  return HttpResponse.json({ success: true });
})
```

## 🧪 테스트 환경

테스트 환경에서 MSW를 사용하려면:

```typescript
// test setup
import { server } from './src/mocks/node';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

## 🔄 실제 API로 전환

실제 백엔드가 준비되면:

1. `src/main.tsx`에서 MSW 초기화 코드 제거 또는 환경 변수로 제어
2. `src/api/index.ts`의 `BASE_URL`을 실제 API 서버 URL로 변경
3. 필요시 API 함수들의 요청/응답 형식 조정

## 🎯 장점

- **빠른 개발**: 백엔드 완성을 기다리지 않고 프론트엔드 개발 가능
- **독립적 개발**: 백엔드 의존성 없이 개발 가능
- **테스트 용이**: 일관된 데이터로 테스트 작성 가능
- **데모**: 실제 API 없이도 완성된 앱처럼 데모 가능
- **프로토타이핑**: 빠른 프로토타입 제작 가능

## ⚠️ 주의사항

- MSW는 개발/테스트 환경에서만 사용됩니다
- 프로덕션 빌드에서는 자동으로 비활성화됩니다
- 실제 네트워크 요청이 아닌 Service Worker를 통한 인터셉트입니다
- 복잡한 비즈니스 로직은 구현되지 않았으므로, 실제 API로 교체 시 추가 작업이 필요할 수 있습니다