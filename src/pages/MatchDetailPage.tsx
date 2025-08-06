import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

interface Match {
  id: number
  title: string
  location: string
  court: string
  date: string
  time: string
  participants: string
  gameType: string
  level: string
  price: string
  status: 'recruiting' | 'full' | 'urgent'
  description: string
  organizer: {
    name: string
    rating: number
    level: string
  }
  participantsList: {
    name: string
    rating: number
    level: string
    joined: boolean
  }[]
}

const MatchDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [match, setMatch] = useState<Match | null>(null)

  useEffect(() => {
    // 실제로는 API에서 데이터를 가져올 것
    const mockMatch: Match = {
      id: parseInt(id || '1'),
      title: '주말 단식 매치',
      location: '올림픽공원 테니스장',
      court: '1번 코트',
      date: '2024-01-15',
      time: '14:00',
      participants: '1/2',
      gameType: '단식',
      level: '중급',
      price: '20,000',
      status: 'recruiting',
      description: '실력 향상을 위한 진지한 단식 매치입니다. 중급 이상의 실력자만 참가해주세요.',
      organizer: {
        name: '김테니스',
        rating: 4.8,
        level: '중급'
      },
      participantsList: [
        {
          name: '김테니스',
          rating: 4.8,
          level: '중급',
          joined: true
        }
      ]
    }
    setMatch(mockMatch)
  }, [id])

  if (!match) {
    return <div>Loading...</div>
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'urgent': return '#ef4444'
      case 'full': return '#64748b'
      default: return '#3b82f6'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'urgent': return '급구'
      case 'full': return '마감'
      default: return '모집중'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="match-detail-page"
    >
      {/* Header */}
      <div className="match-detail-header">
        <motion.button
          className="back-button"
          onClick={() => navigate('/matching')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          ←
        </motion.button>
        <h1>매치 상세</h1>
        <div className="header-actions">
          <motion.button
            className="share-button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            공유
          </motion.button>
        </div>
      </div>

      <div className="match-detail-content">
        {/* Main Match Card */}
        <motion.div
          className="match-detail-card"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="match-card-header">
            <h2>{match.title}</h2>
            <div
              className="status-badge"
              style={{ backgroundColor: getStatusColor(match.status) }}
            >
              {getStatusText(match.status)}
            </div>
          </div>

          <div className="match-description">
            <p>{match.description}</p>
          </div>

          <div className="match-info-grid">
            <div className="info-item">
              <div className="info-icon">📍</div>
              <div className="info-content">
                <div className="info-title">{match.location}</div>
                <div className="info-subtitle">{match.court}</div>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">🕐</div>
              <div className="info-content">
                <div className="info-title">{match.date} {match.time}</div>
                <div className="info-subtitle">소요시간: 2시간</div>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">👥</div>
              <div className="info-content">
                <div className="info-title">참가자: {match.participants}</div>
                <div className="info-subtitle">{match.gameType} • {match.level}</div>
              </div>
            </div>
          </div>

          <div className="price-section">
            <span className="price-label">참가비</span>
            <span className="price-value">{match.price}원</span>
          </div>
        </motion.div>

        {/* Participants Section */}
        <motion.div
          className="participants-section"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3>참가자 ({match.participants})</h3>
          
          <div className="participants-list">
            {match.participantsList.map((participant, index) => (
              <div key={index} className="participant-item">
                <div className="participant-avatar">
                  <span>👤</span>
                </div>
                <div className="participant-info">
                  <div className="participant-name">{participant.name}</div>
                  <div className="participant-details">
                    <span className="rating">⭐ {participant.rating}</span>
                    <span className="level">• {participant.level}</span>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Empty slots */}
            <div className="participant-item empty-slot">
              <div className="participant-avatar empty">
                <span>👤</span>
              </div>
              <div className="participant-info">
                <div className="participant-name">참가자를 기다리고 있습니다</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <motion.button
            className="chat-button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            💬
          </motion.button>
          
          <motion.button
            className="join-button"
            disabled={match.status === 'full'}
            whileHover={match.status !== 'full' ? { scale: 1.02 } : {}}
            whileTap={match.status !== 'full' ? { scale: 0.98 } : {}}
          >
            {match.status === 'full' ? '마감' : '참가 신청'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default MatchDetailPage