import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

interface Notification {
  id: number
  type: 'match' | 'chat' | 'system'
  title: string
  message: string
  time: string
  isRead: boolean
  matchId?: number
}

const NotificationPage = () => {
  const navigate = useNavigate()
  const [notifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'match',
      title: '매칭 신청이 승인되었습니다!',
      message: '주말 단식 매치에 참가가 확정되었습니다.',
      time: '5분 전',
      isRead: false,
      matchId: 1
    },
    {
      id: 2,
      type: 'chat',
      title: '새로운 메시지가 도착했습니다',
      message: '김테니스님이 메시지를 보냈습니다.',
      time: '10분 전',
      isRead: false
    },
    {
      id: 3,
      type: 'match',
      title: '매칭이 곧 시작됩니다',
      message: '올림픽공원 테니스장에서 30분 후 시작됩니다.',
      time: '30분 전',
      isRead: true,
      matchId: 2
    },
    {
      id: 4,
      type: 'system',
      title: '새로운 기능이 추가되었습니다',
      message: '매치 리뷰 기능을 사용해보세요!',
      time: '1시간 전',
      isRead: true
    },
    {
      id: 5,
      type: 'match',
      title: '매칭이 취소되었습니다',
      message: '평일 복식 매치가 주최자 사정으로 취소되었습니다.',
      time: '2시간 전',
      isRead: true,
      matchId: 3
    }
  ])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'match': return '🎾'
      case 'chat': return '💬'
      case 'system': return '📢'
      default: return '📝'
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'match': return '#667eea'
      case 'chat': return '#10b981'
      case 'system': return '#f59e0b'
      default: return '#6b7280'
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    if (notification.type === 'match' && notification.matchId) {
      navigate(`/matching/${notification.matchId}`)
    } else if (notification.type === 'chat') {
      navigate('/chat')
    }
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="notification-page"
    >
      {/* Header */}
      <div className="notification-header">
        <motion.button
          className="back-button"
          onClick={() => navigate('/matching')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          ←
        </motion.button>
        <div className="header-title">
          <h1>알림</h1>
          {unreadCount > 0 && (
            <span className="unread-count">{unreadCount}</span>
          )}
        </div>
        <motion.button
          className="mark-all-read-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          모두 읽음
        </motion.button>
      </div>

      <div className="notification-content">
        <div className="notification-list">
          {notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleNotificationClick(notification)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="notification-icon-container">
                <div 
                  className="notification-icon"
                  style={{ backgroundColor: getNotificationColor(notification.type) }}
                >
                  {getNotificationIcon(notification.type)}
                </div>
                {!notification.isRead && (
                  <div className="unread-dot"></div>
                )}
              </div>

              <div className="notification-content-area">
                <div className="notification-header-info">
                  <h3 className="notification-title">
                    {notification.title}
                  </h3>
                  <span className="notification-time">
                    {notification.time}
                  </span>
                </div>
                <p className="notification-message">
                  {notification.message}
                </p>
                {notification.type === 'match' && (
                  <div className="notification-action">
                    <div className="action-hint">
                      탭하여 매치 상세 보기
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {/* Empty State */}
          {notifications.length === 0 && (
            <motion.div
              className="empty-notifications"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="empty-icon">🔔</div>
              <h3>
                새로운 알림이 없습니다
              </h3>
              <p>
                매칭 신청이나 메시지가 도착하면 알려드릴게요!
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default NotificationPage