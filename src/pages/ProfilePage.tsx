import { motion } from 'framer-motion'
import { useTheme } from '../contexts/ThemeContext'

const ProfilePage = () => {
  const { isDark, toggle } = useTheme()
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="page"
    >
      <div className="page-header">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          👤 프로필
        </motion.h1>
      </div>
      
      <div className="page-content">
        <motion.div
          className="profile-card"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="profile-avatar">
            <motion.div
              className="avatar-circle"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              👨‍💼
            </motion.div>
          </div>
          <div className="profile-info">
            <h2>홍길동</h2>
            <p className="profile-level">중급 플레이어</p>
            <p className="profile-location">서울시 강남구</p>
          </div>
        </motion.div>
        
        <motion.div
          className="card"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="profile-stats">
            <div className="stat-item">
              <div className="stat-value">47</div>
              <div className="stat-label">총 경기</div>
            </div>
            <div className="stat-item stat-wins">
              <div className="stat-value">32</div>
              <div className="stat-label">승리</div>
            </div>
            <div className="stat-item stat-rate">
              <div className="stat-value">68%</div>
              <div className="stat-label">승률</div>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          className="profile-menu"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <motion.button
            className="menu-item"
            onClick={toggle}
            whileHover={{ x: 4 }}
          >
            <div className="menu-item-content">
              <span className="menu-icon">{isDark ? '🌙' : '☀️'}</span>
              <span className="menu-text">
                {isDark ? '다크 모드' : '라이트 모드'}
              </span>
            </div>
            <span className="menu-arrow">›</span>
          </motion.button>
          
          <motion.div
            className="menu-item"
            whileHover={{ x: 4 }}
          >
            <div className="menu-item-content">
              <span className="menu-icon">⚙️</span>
              <span className="menu-text">설정</span>
            </div>
            <span className="menu-arrow">›</span>
          </motion.div>
          
          <motion.div
            className="menu-item"
            whileHover={{ x: 4 }}
          >
            <div className="menu-item-content">
              <span className="menu-icon">📊</span>
              <span className="menu-text">경기 기록</span>
            </div>
            <span className="menu-arrow">›</span>
          </motion.div>
          
          <motion.div
            className="menu-item"
            whileHover={{ x: 4 }}
          >
            <div className="menu-item-content">
              <span className="menu-icon">🏆</span>
              <span className="menu-text">업적</span>
            </div>
            <span className="menu-arrow">›</span>
          </motion.div>
          
          <motion.div
            className="menu-item"
            whileHover={{ x: 4 }}
          >
            <div className="menu-item-content">
              <span className="menu-icon">❓</span>
              <span className="menu-text">도움말</span>
            </div>
            <span className="menu-arrow">›</span>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default ProfilePage