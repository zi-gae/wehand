import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'

interface Message {
  id: number
  type: 'text' | 'system' | 'match-info'
  sender: string
  content: string
  timestamp: string
  isOwn: boolean
  matchId?: number
}

interface ChatRoomInfo {
  id: number
  name: string
  type: 'match' | 'general'
  participants: number
  matchId?: number
  matchTitle?: string
}

const ChatRoomPage = () => {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  
  // 채팅방 정보 (실제로는 API에서 가져올 데이터)
  const [chatRoom] = useState<ChatRoomInfo>({
    id: parseInt(roomId || '1'),
    name: '🎾 주말 단식 매치 채팅방',
    type: 'match',
    participants: 2,
    matchId: 1,
    matchTitle: '주말 단식 매치'
  })

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'system',
      sender: 'system',
      content: '채팅방에 입장하셨습니다.',
      timestamp: '14:00',
      isOwn: false
    },
    {
      id: 2,
      type: 'match-info',
      sender: 'system',
      content: '매치 정보를 확인하세요!',
      timestamp: '14:01',
      isOwn: false,
      matchId: 1
    },
    {
      id: 3,
      type: 'text',
      sender: '김테니스',
      content: '안녕하세요! 매치 준비는 어떻게 되고 계신가요?',
      timestamp: '14:05',
      isOwn: false
    },
    {
      id: 4,
      type: 'text',
      sender: '나',
      content: '네, 준비 완료입니다! 정시에 도착할 예정이에요.',
      timestamp: '14:06',
      isOwn: true
    },
    {
      id: 5,
      type: 'text',
      sender: '김테니스',
      content: '좋습니다! 혹시 라켓은 준비되셨나요? 예비 라켓도 가져갈 예정입니다.',
      timestamp: '14:07',
      isOwn: false
    }
  ])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: messages.length + 1,
      type: 'text',
      sender: '나',
      content: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }),
      isOwn: true
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')
    
    // 타이핑 시뮬레이션 (실제 앱에서는 웹소켓을 통한 실시간 통신)
    setTimeout(() => {
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        const reply: Message = {
          id: messages.length + 2,
          type: 'text',
          sender: '김테니스',
          content: '네, 알겠습니다! 😊',
          timestamp: new Date().toLocaleTimeString('ko-KR', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          }),
          isOwn: false
        }
        setMessages(prev => [...prev, reply])
      }, 2000)
    }, 500)
  }

  const handleMatchInfoClick = (matchId: number) => {
    navigate(`/matching/${matchId}`)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="chat-room-page"
    >
      {/* Header */}
      <div className="chat-room-header">
        <motion.button
          className="back-button"
          onClick={() => navigate('/chat')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          ←
        </motion.button>
        
        <div className="chat-room-info">
          <h1>{chatRoom.name}</h1>
          <span className="participants-info">👥 {chatRoom.participants}명 참여</span>
        </div>

        <div className="header-actions">
          {chatRoom.type === 'match' && chatRoom.matchId && (
            <motion.button
              className="match-detail-btn"
              onClick={() => handleMatchInfoClick(chatRoom.matchId!)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              📋
            </motion.button>
          )}
          <motion.button
            className="menu-btn"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            ⋯
          </motion.button>
        </div>
      </div>

      {/* Match Info Banner (매치 채팅방인 경우) */}
      {chatRoom.type === 'match' && chatRoom.matchId && (
        <motion.div
          className="match-info-banner"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          onClick={() => handleMatchInfoClick(chatRoom.matchId!)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="match-info-content">
            <div className="match-info-icon">🎾</div>
            <div className="match-info-text">
              <h3>{chatRoom.matchTitle}</h3>
              <p>매치 상세 정보 보기 →</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Messages Area */}
      <div className="messages-container">
        <div className="messages-list">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                className={`message ${message.isOwn ? 'own' : 'other'} ${message.type}`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {message.type === 'system' && (
                  <div className="system-message">
                    <span>{message.content}</span>
                  </div>
                )}

                {message.type === 'match-info' && (
                  <motion.div
                    className="match-info-message"
                    onClick={() => message.matchId && handleMatchInfoClick(message.matchId)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="match-info-bubble">
                      <div className="match-info-header">
                        <span className="match-icon">🎾</span>
                        <span>매치 정보</span>
                      </div>
                      <p>{message.content}</p>
                      <div className="match-info-action">
                        탭하여 상세 보기 →
                      </div>
                    </div>
                  </motion.div>
                )}

                {message.type === 'text' && (
                  <div className="text-message">
                    {!message.isOwn && (
                      <div className="message-sender">{message.sender}</div>
                    )}
                    <div className="message-bubble">
                      <span className="message-content">{message.content}</span>
                    </div>
                    <div className="message-time">{message.timestamp}</div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              className="typing-indicator"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="typing-bubble">
                <div className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <span className="typing-text">김테니스님이 입력 중...</span>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="chat-input-container">
        <div className="chat-input-wrapper">
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="메시지를 입력하세요..."
            className="chat-input"
          />
          <motion.button
            className={`send-button ${newMessage.trim() ? 'active' : ''}`}
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            whileHover={newMessage.trim() ? { scale: 1.1 } : {}}
            whileTap={newMessage.trim() ? { scale: 0.9 } : {}}
          >
            📤
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default ChatRoomPage