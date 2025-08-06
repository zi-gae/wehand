import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface MatchingFilters {
  search: string
  region: string
  gameType: string
  ntrpMin: number
  ntrpMax: number
  date: string
  timeMin: number
  timeMax: number
}

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
}

const MatchingPage = () => {
  const navigate = useNavigate()
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState<MatchingFilters>({
    search: '',
    region: '',
    gameType: '',
    ntrpMin: 1.0,
    ntrpMax: 7.0,
    date: '',
    timeMin: 0,
    timeMax: 23
  })

  const [matches] = useState<Match[]>([
    {
      id: 1,
      title: '주말 단식 매치',
      location: '올림픽공원 테니스장',
      court: '1번 코트',
      date: '2024-01-15',
      time: '14:00',
      participants: '1/2',
      gameType: '단식',
      level: '중급',
      price: '20,000원',
      status: 'recruiting'
    },
    {
      id: 2,
      title: '평일 혼성복식',
      location: '잠실 테니스장',
      court: '3번 코트',
      date: '2024-01-16',
      time: '19:00',
      participants: '3/4',
      gameType: '혼복',
      level: '초급',
      price: '15,000원',
      status: 'urgent'
    },
    {
      id: 3,
      title: '토요일 남성복식',
      location: '한강공원 테니스장',
      court: '2번 코트',
      date: '2024-01-17',
      time: '10:00',
      participants: '4/4',
      gameType: '남복',
      level: '고급',
      price: '25,000원',
      status: 'full'
    }
  ])

  const handleFilterChange = (key: keyof MatchingFilters, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleRangeChange = (type: 'ntrp' | 'time', minValue: number, maxValue: number) => {
    if (type === 'ntrp') {
      setFilters(prev => ({
        ...prev,
        ntrpMin: minValue,
        ntrpMax: maxValue
      }))
    } else {
      setFilters(prev => ({
        ...prev,
        timeMin: minValue,
        timeMax: maxValue
      }))
    }
  }

  const getNtrpLabel = (value: number) => {
    if (value < 2) return '입문자'
    if (value < 3) return '초보자'
    if (value < 4) return '초급자'
    if (value < 5) return '중급자'
    if (value < 6) return '상급자'
    return '전문가'
  }

  const getTimeLabel = (hour: number) => {
    const formatHour = (h: number) => h.toString().padStart(2, '0')
    
    if (hour === 0) return `자정 (${formatHour(hour)}:00)`
    if (hour < 12) return `오전 ${formatHour(hour)}:00`
    if (hour === 12) return `정오 (${formatHour(hour)}:00)`
    return `오후 ${formatHour(hour - 12)}:00`
  }

  const handleMatchClick = (matchId: number) => {
    navigate(`/matching/${matchId}`)
  }

  const getStatusBadge = (status: string, level: string) => {
    if (status === 'urgent') return { text: '급구', className: 'urgent' }
    if (status === 'full') return { text: '마감', className: 'full' }
    return { text: level, className: 'recruiting' }
  }

  const filteredMatches = matches.filter(match => {
    if (filters.search && !match.title.toLowerCase().includes(filters.search.toLowerCase())) {
      return false
    }
    if (filters.region && !match.location.includes(filters.region)) {
      return false
    }
    if (filters.gameType && match.gameType !== filters.gameType) {
      return false
    }
    // NTRP 범위 필터링 (예시: 레벨을 숫자로 변환)
    const matchNtrp = match.level === '초급' ? 3.0 : match.level === '중급' ? 4.0 : match.level === '고급' ? 5.0 : 3.0
    if (matchNtrp < filters.ntrpMin || matchNtrp > filters.ntrpMax) {
      return false
    }
    return true
  })

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="page"
    >
      {/* Header with Search */}
      <motion.div
        className="matching-header"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="header-top">
          <h1>매칭 찾기</h1>
          <div className="header-actions">
            <motion.button
              className="header-action-btn"
              onClick={() => navigate('/notifications')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🔔
              <span className="notification-badge">3</span>
            </motion.button>
            <motion.button
              className="header-action-btn"
              onClick={() => navigate('/chat')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              💬
              <span className="chat-badge">2</span>
            </motion.button>
          </div>
        </div>
        <div className="header-search">
          <input
            type="text"
            placeholder="매칭 검색..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="header-search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
      </motion.div>

      {/* Floating Filter Button */}
      <motion.button
        className="floating-filter-btn"
        onClick={() => setIsFilterOpen(true)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <span className="filter-icon">⚙️</span>
        <span className="filter-text">필터</span>
      </motion.button>

      {/* Filter Modal/Overlay */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div
              className="filter-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
            />
            <motion.div
              className="filter-modal"
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="filter-modal-header">
                <h2>필터 설정</h2>
                <motion.button
                  className="close-filter-btn"
                  onClick={() => setIsFilterOpen(false)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ✕
                </motion.button>
              </div>
              
              <div className="filter-modal-content">
                <div className="filter-group">
                  <label>지역</label>
                  <select 
                    value={filters.region} 
                    onChange={(e) => handleFilterChange('region', e.target.value)}
                    className="filter-select-modal"
                  >
                    <option value="">전체</option>
                    <option value="올림픽공원">올림픽공원</option>
                    <option value="잠실">잠실</option>
                    <option value="한강공원">한강공원</option>
                    <option value="반포">반포</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label>게임 타입</label>
                  <select 
                    value={filters.gameType} 
                    onChange={(e) => handleFilterChange('gameType', e.target.value)}
                    className="filter-select-modal"
                  >
                    <option value="">전체</option>
                    <option value="단식">단식</option>
                    <option value="혼복">혼복</option>
                    <option value="남복">남복</option>
                    <option value="여복">여복</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label>NTRP 범위</label>
                  <div className="range-container">
                    <div className="range-labels">
                      <span>{filters.ntrpMin}</span>
                      <span>-</span>
                      <span>{filters.ntrpMax}</span>
                    </div>
                    <div className="range-description">
                      <span>{getNtrpLabel(filters.ntrpMin)} ~ {getNtrpLabel(filters.ntrpMax)}</span>
                    </div>
                    <div className="dual-range-slider">
                      <div 
                        className="range-track-active"
                        style={{
                          left: `${((filters.ntrpMin - 1) / 6) * 100}%`,
                          width: `${((filters.ntrpMax - filters.ntrpMin) / 6) * 100}%`
                        }}
                      />
                      <input
                        type="range"
                        min="1"
                        max="7"
                        step="0.5"
                        value={filters.ntrpMin}
                        onChange={(e) => {
                          const newMin = parseFloat(e.target.value)
                          handleRangeChange('ntrp', newMin, Math.max(newMin, filters.ntrpMax))
                        }}
                        className="range-input range-min"
                      />
                      <input
                        type="range"
                        min="1"
                        max="7"
                        step="0.5"
                        value={filters.ntrpMax}
                        onChange={(e) => {
                          const newMax = parseFloat(e.target.value)
                          handleRangeChange('ntrp', Math.min(filters.ntrpMin, newMax), newMax)
                        }}
                        className="range-input range-max"
                      />
                    </div>
                  </div>
                </div>

                <div className="filter-group">
                  <label>날짜</label>
                  <input
                    type="date"
                    value={filters.date}
                    onChange={(e) => handleFilterChange('date', e.target.value)}
                    className="filter-select-modal"
                  />
                </div>

                <div className="filter-group">
                  <label>시간 범위</label>
                  <div className="range-container">
                    <div className="range-labels">
                      <span>{getTimeLabel(filters.timeMin)}</span>
                      <span>-</span>
                      <span>{getTimeLabel(filters.timeMax)}</span>
                    </div>
                    <div className="range-description">
                      <span>{filters.timeMax - filters.timeMin + 1}시간 범위</span>
                    </div>
                    <div className="dual-range-slider">
                      <div 
                        className="range-track-active"
                        style={{
                          left: `${(filters.timeMin / 23) * 100}%`,
                          width: `${((filters.timeMax - filters.timeMin) / 23) * 100}%`
                        }}
                      />
                      <input
                        type="range"
                        min="0"
                        max="23"
                        step="1"
                        value={filters.timeMin}
                        onChange={(e) => {
                          const newMin = parseInt(e.target.value)
                          handleRangeChange('time', newMin, Math.max(newMin, filters.timeMax))
                        }}
                        className="range-input range-min"
                      />
                      <input
                        type="range"
                        min="0"
                        max="23"
                        step="1"
                        value={filters.timeMax}
                        onChange={(e) => {
                          const newMax = parseInt(e.target.value)
                          handleRangeChange('time', Math.min(filters.timeMin, newMax), newMax)
                        }}
                        className="range-input range-max"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="filter-modal-actions">
                <motion.button
                  className="reset-filters-btn"
                  onClick={() => setFilters({ 
                    search: filters.search, 
                    region: '', 
                    gameType: '', 
                    ntrpMin: 1.0, 
                    ntrpMax: 7.0, 
                    date: '', 
                    timeMin: 0, 
                    timeMax: 23 
                  })}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  초기화
                </motion.button>
                <motion.button
                  className="apply-filters-btn"
                  onClick={() => setIsFilterOpen(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  적용
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Match List */}
      <div className="match-list-section">
        {filteredMatches.map((match, index) => {
          const badge = getStatusBadge(match.status, match.level)
          return (
            <motion.div
              key={match.id}
              className={`match-card ${match.status}`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -2 }}
              onClick={() => handleMatchClick(match.id)}
            >
              <div className="match-header">
                <h3 className="match-title">{match.title}</h3>
                <span className={`match-badge ${badge.className}`}>
                  {badge.text}
                </span>
              </div>
              
              <div className="match-info">
                <div className="info-item">
                  <span className="info-icon">📍</span>
                  <span>{match.location} - {match.court}</span>
                </div>
                <div className="info-item">
                  <span className="info-icon">🕐</span>
                  <span>{match.date} {match.time}</span>
                </div>
                <div className="info-item">
                  <span className="info-icon">👥</span>
                  <span>참가자: {match.participants}</span>
                </div>
              </div>

              <div className="match-footer">
                <div className="match-tags">
                  <span className="tag">
                    {match.gameType}
                  </span>
                  <span className="tag">
                    {match.level}
                  </span>
                </div>
                <div className="match-price-action">
                  <span className="match-price">{match.price}</span>
                  <motion.button
                    className={match.status === 'full' ? 'join-button disabled' : 'join-button'}
                    disabled={match.status === 'full'}
                    whileHover={match.status !== 'full' ? { scale: 1.05 } : {}}
                    whileTap={match.status !== 'full' ? { scale: 0.95 } : {}}
                  >
                    {match.status === 'full' ? '마감' : '참가 신청'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )
        })}
        
        {filteredMatches.length === 0 && (
          <motion.div 
            className="no-matches"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="empty-icon">🎾</div>
            <h3>
              매칭을 찾을 수 없습니다
            </h3>
            <p>
              검색 조건을 변경하거나 새로운 매치를 생성해보세요.
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default MatchingPage