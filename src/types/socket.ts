// 웹소켓 이벤트 타입 정의

export interface NewMessageEvent {
  id: string;
  content: string;
  messageType: 'text' | 'image' | 'system';
  sender: {
    id: string;
    nickname: string;
    profile_image_url?: string;
  } | null;
  timestamp: string;
  chatRoomId: string;
}

export interface MessageReadByEvent {
  userId: string;
  messageId: string;
  timestamp: string;
}

export interface UserJoinedEvent {
  userId: string;
  nickname: string;
  timestamp: string;
}

export interface UserLeftEvent {
  userId: string;
  nickname: string;
  timestamp: string;
}

export interface ParticipantApprovedEvent {
  participantId: string;
  participantName: string;
  matchId: string;
}

// Socket Event Names
export enum SocketEvent {
  // Connection Events
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  ERROR = 'error',
  
  // Chat Room Events
  JOIN_ROOM = 'join-room',
  LEAVE_ROOM = 'leave-room',
  
  // Message Events
  NEW_MESSAGE = 'new-message',
  MESSAGE_READ_BY = 'message-read-by',
  
  // User Events
  USER_JOINED = 'user-joined',
  USER_LEFT = 'user-left',
  
  // Match Events
  PARTICIPANT_APPROVED = 'participant-approved',
}

// Socket Error Event
export interface SocketError {
  code: string;
  message: string;
}