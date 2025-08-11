// API 클라이언트와 생성된 API 함수들을 export
export { apiClient, customAxiosInstance } from "./api-client";
export * from "./generated-api";

// 주요 타입들을 별도로 export (편의성)
export type {
  User,
  Match,
  Post,
  ChatRoom,
  ChatMessage,
  Notification,
  LoginRequest,
  LoginResponse,
  CreateMatchRequest,
  CreatePostRequest,
  SendMessageRequest,
} from "./generated-api";
