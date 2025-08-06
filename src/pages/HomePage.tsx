import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
  const navigate = useNavigate()

  const handleCreateMatch = () => {
    navigate('/create')
  }

  const handleFindMatch = () => {
    navigate('/matching')
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="page home-page"
    >
      {/* Header Section */}
      <motion.div
        className="home-header"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="user-greeting">
          <h1>안녕하세요!</h1>
          <p>오늘도 즐거운 테니스 하세요 🎾</p>
        </div>
        <div className="weather-info">
          <span className="weather-icon">☀️</span>
          <span className="temperature">24°</span>
        </div>
      </motion.div>

      <div className="page-content">
        {/* Quick Action Cards */}
        <motion.div
          className="quick-actions"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            className="action-card create-match"
            onClick={handleCreateMatch}
            whileHover={{ scale: 1.02, y: -3 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="action-icon">
              <span className="icon-plus">+</span>
            </div>
            <h3>매칭 생성</h3>
          </motion.div>

          <motion.div
            className="action-card find-match"
            onClick={handleFindMatch}
            whileHover={{ scale: 1.02, y: -3 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="action-icon">
              <span className="icon-users">👥</span>
            </div>
            <h3>매칭 찾기</h3>
          </motion.div>
        </motion.div>

        {/* Recent Matches Section */}
        <motion.div
          className="recent-section"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="section-header">
            <h2>최근 매칭</h2>
            <button className="view-all-btn">전체보기</button>
          </div>

          <div className="match-list">
            <motion.div
              className="match-item"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="match-info">
                <h4>주말 단식 매치</h4>
                <div className="match-details">
                  <span className="location">📍 올림픽공원 테니스장</span>
                  <span className="time">🕐 2024-01-15 14:00</span>
                  <span className="participants">👥 참가자: 2/2</span>
                </div>
              </div>
              <div className="match-status completed">
                <span>종료</span>
              </div>
            </motion.div>

            <motion.div
              className="match-item"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="match-info">
                <h4>평일 복식 게임</h4>
                <div className="match-details">
                  <span className="location">📍 잠실 테니스장</span>
                  <span className="time">🕐 2024-01-16 19:00</span>
                  <span className="participants">👥 참가자: 3/4</span>
                </div>
              </div>
              <div className="match-status upcoming">
                <span>예정</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default HomePage