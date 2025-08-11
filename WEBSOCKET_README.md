# WeHand Tennis App - WebSocket 채팅 기능

이 문서는 WeHand 테니스 앱의 실시간 채팅 기능에 대한 구현 설명입니다.

## 🚀 WebSocket 목서버 기능

### 주요 특징

- **실시간 메시지 송수신**: WebSocket을 통한 즉시 메시지 전달
- **자동 메시지 생성**: 30초~2분 간격으로 랜덤 메시지 자동 생성
- **다중 채팅방 지원**: 여러 채팅방 동시 관리
- **연결 상태 관리**: 연결/연결 중/오류 상태 표시
- **메시지 히스토리**: 채팅방 입장 시 기존 메시지 로드
- **시스템 메시지**: 입장/퇴장 등 시스템 알림

### 구현된 파일

#### 1. 목서버 (`src/mocks/websocket-server.ts`)

```typescript
// 주요 클래스
- MockWebSocketServer: 전체 WebSocket 서버 시뮬레이션
- MockWebSocket: 클라이언트 WebSocket 연결 시뮬레이션

// 주요 기능
- connect(): 채팅방 연결
- disconnect(): 연결 해제
- sendMessage(): 메시지 전송
- getMessageHistory(): 메시지 히스토리 조회
```

#### 2. React Hook (`src/hooks/useWebSocket.ts`)

```typescript
// useWebSocket Hook
interface UseWebSocketOptions {
  roomId: number;
  onMessage?: (message: ChatMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
}

// 반환값
interface UseWebSocketReturn {
  messages: ChatMessage[];
  sendMessage: (content: string, type?: string) => void;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  reconnect: () => void;
}
```

#### 3. 업데이트된 ChatRoomPage (`src/pages/ChatRoomPage.tsx`)

- WebSocket Hook 사용
- 실시간 메시지 표시
- 연결 상태 UI 표시
- 메시지 전송 기능

### 사용 방법

1. **개발 서버 시작**

```bash
npm run dev
```

2. **채팅방 접속**

- 앱에서 채팅방으로 이동
- WebSocket 연결 자동 시작
- 기존 메시지 히스토리 로드

3. **메시지 전송**

- 하단 입력창에 메시지 입력
- Enter 키 또는 전송 버튼 클릭
- 실시간으로 다른 사용자에게 메시지 전달

### API 스펙 준수

웹소켓 구현은 `API_SPEC.md`의 다음 스펙을 따릅니다:

#### WebSocket 연결

```
wss://api.wehand.tennis/ws/chats/{roomId}
```

#### 메시지 형식

```json
{
  "type": "message",
  "data": {
    "id": 123,
    "sender": "김테니스",
    "content": "안녕하세요!",
    "timestamp": "14:05",
    "messageType": "text"
  }
}
```

### 자동 기능

1. **자동 재연결**: 연결이 끊어지면 최대 5회 자동 재연결 시도
2. **자동 메시지**: 30초~2분 간격으로 랜덤 메시지 생성
3. **메시지 중복 방지**: 동일한 ID의 메시지 중복 표시 방지
4. **스크롤 자동 이동**: 새 메시지 수신 시 자동으로 하단 스크롤

### 개발 환경 설정

WebSocket 목서버는 개발 환경에서만 활성화됩니다:

```typescript
// 전역 WebSocket 클래스 모킹 (개발 환경에서만)
if (process.env.NODE_ENV === "development") {
  (globalThis as any).WebSocket = MockWebSocket;
}
```

### 테스트 방법

1. **단일 사용자 테스트**

   - 채팅방 입장
   - 메시지 전송
   - 자동 메시지 수신 확인

2. **다중 창 테스트**

   - 여러 브라우저 탭에서 동일 채팅방 접속
   - 한 탭에서 메시지 전송
   - 다른 탭에서 실시간 수신 확인

3. **연결 상태 테스트**
   - 네트워크 차단 시뮬레이션
   - 자동 재연결 확인
   - 오류 상태 표시 확인

### 향후 개선 사항

1. **파일 첨부**: 이미지/파일 전송 기능
2. **읽음 상태**: 메시지 읽음/안읽음 표시
3. **타이핑 표시**: 다른 사용자가 입력 중일 때 표시
4. **푸시 알림**: 백그라운드에서 메시지 수신 시 알림
5. **메시지 검색**: 채팅 히스토리 검색 기능

### 주의사항

- 현재는 개발/테스트 목적의 목서버입니다
- 실제 배포 시에는 실제 WebSocket 서버로 교체 필요
- 메시지는 메모리에만 저장되므로 새로고침 시 초기화됩니다
- 보안 기능 (인증, 암호화)은 구현되지 않았습니다

---

이 WebSocket 구현을 통해 실시간 채팅 기능을 테스트하고 사용자 경험을 개선할 수 있습니다.

```
const socket = io('ws://localhost:3000', {
    auth: {
      token: 'your-jwt-token'
    }
  });

  socket.emit('join-chat-room', 'room-uuid');
  socket.on('new-message', (message) => {
    console.log('새 메시지:', message);
  });
```
