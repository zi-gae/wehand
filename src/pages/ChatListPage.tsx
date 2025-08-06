import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

interface ChatRoom {
  id: number
  type: 'match' | 'general'
  name: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  matchId?: number
  participants?: number
  isAnnouncement?: boolean
}

const ChatListPage = () => {
  const navigate = useNavigate()
  const [chatRooms] = useState<ChatRoom[]>([
    {
      id: 1,
      type: 'match',
      name: '🎾 주말 단식 매치 채팅방',
      lastMessage: '매치가 곧 시작됩니다! 준비해주세요.',
      lastMessageTime: '방금 전',
      unreadCount: 3,
      matchId: 1,
      participants: 2,
      isAnnouncement: true
    },
    {
      id: 2,
      type: 'match',
      name: '🏓 평일 혼성복식 채팅방',
      lastMessage: '김테니스: 코트 변경 안내드립니다.',
      lastMessageTime: '5분 전',
      unreadCount: 1,
      matchId: 2,
      participants: 4
    },
    {
      id: 3,
      type: 'match',
      name: '🔥 토요일 남성복식 채팅방',
      lastMessage: '매치 완료! 다들 수고하셨습니다 👏',
      lastMessageTime: '30분 전',
      unreadCount: 0,
      matchId: 3,
      participants: 4
    },
    {
      id: 4,
      type: 'general',
      name: '💬 테니스 친구들',
      lastMessage: '이번 주말에 연습 어때요?',
      lastMessageTime: '1시간 전',
      unreadCount: 2,
      participants: 8
    }
  ])

  const handleChatClick = (chatRoom: ChatRoom) => {
    // 모든 채팅방에 대해 채팅방 페이지로 이동
    navigate(`/chat/${chatRoom.id}`)
  }

  const getChatIcon = (chatRoom: ChatRoom) => {
    if (chatRoom.type === 'match') {
      return chatRoom.isAnnouncement ? '📢' : '🎾'
    }
    return '💬'
  }

  const getChatBadgeColor = (chatRoom: ChatRoom) => {
    if (chatRoom.type === 'match') {
      return chatRoom.isAnnouncement ? '#ef4444' : '#3b82f6'
    }
    return '#10b981'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="chat-list-page"
    >
      {/* Header */}
      <div className="chat-list-header">
        <motion.button
          className="back-button"
          onClick={() => navigate('/matching')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          ←
        </motion.button>
        <div className="header-title">
          <h1>채팅</h1>
          <span className="chat-count">{chatRooms.length}개 채팅방</span>
        </div>
      </div>

      <div className="chat-list-content">
        {/* Announcement Section */}
        <motion.div
          className="announcement-section"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="announcement-header">
            <span className="announcement-icon">📢</span>
            <h3>매치 공지사항</h3>
          </div>
          <div className="announcement-content">
            <p>매치 관련 중요 공지사항을 확인하세요!</p>
            <span className="announcement-hint">매치 채팅방을 탭하면 상세 정보를 볼 수 있습니다.</span>
          </div>
        </motion.div>

        {/* Chat Rooms List */}
        <div className="chat-rooms-list">
          {chatRooms.map((chatRoom, index) => (
            <motion.div
              key={chatRoom.id}
              className={`chat-room-item ${chatRoom.type}`}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              onClick={() => handleChatClick(chatRoom)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="chat-room-avatar">
                <div 
                  className="avatar-icon"
                  style={{ backgroundColor: getChatBadgeColor(chatRoom) }}
                >
                  {getChatIcon(chatRoom)}
                </div>
                {chatRoom.unreadCount > 0 && (
                  <div className="unread-badge">
                    {chatRoom.unreadCount}
                  </div>
                )}
              </div>

              <div className="chat-room-content">
                <div className="chat-room-header">
                  <h3 className="chat-room-name">{chatRoom.name}</h3>
                  <span className="chat-time">{chatRoom.lastMessageTime}</span>
                </div>
                <div className="chat-room-info">
                  <p className="last-message">{chatRoom.lastMessage}</p>
                  <div className="chat-room-details">
                    <span className="participants-count">👥 {chatRoom.participants}명</span>
                    {chatRoom.type === 'match' && (
                      <span className="match-badge">매치 채팅</span>
                    )}
                  </div>
                </div>
                {chatRoom.type === 'match' && (
                  <div className="match-action-hint">
                    <span>→ 매치 상세 보기</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {chatRooms.length === 0 && (
          <motion.div
            className="empty-chat-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="empty-icon">💬</div>
            <h3>아직 참여한 채팅방이 없습니다</h3>
            <p>매치에 참가하면 자동으로 채팅방이 생성됩니다!</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default ChatListPage