import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

interface FormData {
  court: string
  courtNumber: string
  date: string
  timeStart: number
  timeEnd: number
  skillMin: number
  skillMax: number
  ntrpMin: number
  ntrpMax: number
  gameType: string
  maleGuests: number
  femaleGuests: number
}

const CreatePage = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    court: '',
    courtNumber: '',
    date: '',
    timeStart: 14,
    timeEnd: 16,
    skillMin: 1,
    skillMax: 5,
    ntrpMin: 2.0,
    ntrpMax: 4.0,
    gameType: '',
    maleGuests: 2,
    femaleGuests: 1
  })

  const totalSteps = 6

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    console.log('Form submitted:', formData)
    // 여기서 매칭 생성 API 호출
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="page create-wizard-page"
    >
      {/* Progress Header */}
      <div className="wizard-header">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
        <div className="step-indicator">
          {currentStep} / {totalSteps}
        </div>
      </div>

      <div className="wizard-content">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <Step1
              key="step1"
              formData={formData}
              setFormData={setFormData}
              onNext={nextStep}
            />
          )}
          {currentStep === 2 && (
            <Step2
              key="step2"
              formData={formData}
              setFormData={setFormData}
              onNext={nextStep}
              onPrev={prevStep}
            />
          )}
          {currentStep === 3 && (
            <Step3
              key="step3"
              formData={formData}
              setFormData={setFormData}
              onNext={nextStep}
              onPrev={prevStep}
            />
          )}
          {currentStep === 4 && (
            <Step4
              key="step4"
              formData={formData}
              setFormData={setFormData}
              onNext={nextStep}
              onPrev={prevStep}
            />
          )}
          {currentStep === 5 && (
            <Step5
              key="step5"
              formData={formData}
              setFormData={setFormData}
              onNext={nextStep}
              onPrev={prevStep}
            />
          )}
          {currentStep === 6 && (
            <Step6
              key="step6"
              formData={formData}
              setFormData={setFormData}
              onPrev={prevStep}
              onSubmit={handleSubmit}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// Step 1: 테니스장 검색
const Step1 = ({ formData, setFormData, onNext }: any) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredCourts, setFilteredCourts] = useState<string[]>([])
  
  const allCourts = ['올림픽공원 테니스장', '잠실 테니스장', '한강공원 테니스장', '반포 테니스장', '서울숲 테니스장', '한강시민공원 테니스장']
  const favoriteCourts = ['올림픽공원 테니스장', '잠실 테니스장']

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      const filtered = allCourts.filter(court => 
        court.toLowerCase().includes(query.toLowerCase())
      )
      setFilteredCourts(filtered)
    } else {
      setFilteredCourts([])
    }
  }

  const selectCourt = (court: string) => {
    setFormData({ ...formData, court })
    setSearchQuery(court)
    setFilteredCourts([])
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="wizard-step"
    >
      <h2>테니스장을 검색해 주세요</h2>
      
      <div className="form-group">
        <label>테니스장 검색</label>
        <div className="search-container">
          <input
            type="text"
            placeholder="테니스장 이름을 입력하세요"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="search-input"
          />
          {filteredCourts.length > 0 && (
            <div className="search-results">
              {filteredCourts.map(court => (
                <motion.div
                  key={court}
                  className="search-result-item"
                  onClick={() => selectCourt(court)}
                  whileHover={{ backgroundColor: '#f8fafc' }}
                >
                  📍 {court}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="form-group">
        <label>즐겨찾는 코트</label>
        <div className="favorite-courts">
          {favoriteCourts.map(court => (
            <motion.button
              key={court}
              className={`favorite-court-button ${formData.court === court ? 'active' : ''}`}
              onClick={() => selectCourt(court)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              ⭐ {court}
            </motion.button>
          ))}
        </div>
      </div>

      <button
        className="next-button"
        onClick={onNext}
        disabled={!formData.court}
      >
        다음
      </button>
    </motion.div>
  )
}

// Step 2: 코트 번호 선택
const Step2 = ({ formData, setFormData, onNext, onPrev }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="wizard-step"
    >
      <h2>코트 번호를 선택해 주세요</h2>
      
      <div className="selected-court-info">
        <p className="selected-court">📍 {formData.court}</p>
      </div>

      <div className="form-group">
        <label>코트 번호</label>
        <div className="court-grid">
          {[1, 2, 3, 4, 5, 6].map(num => (
            <motion.button
              key={num}
              className={`court-button ${formData.courtNumber === num.toString() ? 'active' : ''}`}
              onClick={() => setFormData({ ...formData, courtNumber: num.toString() })}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {num}번 코트
            </motion.button>
          ))}
        </div>
      </div>

      <div className="wizard-buttons">
        <button className="prev-button" onClick={onPrev}>이전</button>
        <button 
          className="next-button" 
          onClick={onNext}
          disabled={!formData.courtNumber}
        >
          다음
        </button>
      </div>
    </motion.div>
  )
}

// Step 3: 날짜 및 시간 선택
const Step3 = ({ formData, setFormData, onNext, onPrev }: any) => {
  const generateCalendar = () => {
    const days = []
    const today = new Date()
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()
    
    // 이번 달의 마지막 날
    const lastDay = new Date(currentYear, currentMonth + 1, 0)
    
    // 달력 생성 (간단한 버전)
    for (let date = 1; date <= lastDay.getDate(); date++) {
      days.push(date)
    }
    
    return days
  }

  const getTimeLabel = (hour: number) => {
    const formatHour = (h: number) => h.toString().padStart(2, '0')
    
    if (hour === 0) return `자정 (${formatHour(hour)}:00)`
    if (hour < 12) return `오전 ${formatHour(hour)}:00`
    if (hour === 12) return `정오 (${formatHour(hour)}:00)`
    return `오후 ${formatHour(hour - 12)}:00`
  }

  const handleTimeRangeChange = (type: 'start' | 'end', value: number) => {
    if (type === 'start') {
      setFormData({ 
        ...formData, 
        timeStart: value, 
        timeEnd: Math.max(value, formData.timeEnd) 
      })
    } else {
      setFormData({ 
        ...formData, 
        timeEnd: value,
        timeStart: Math.min(formData.timeStart, value)
      })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="wizard-step"
    >
      <h2>날짜와 시간을 선택해 주세요</h2>
      
      <div className="calendar-section">
        <div className="calendar-header">
          <button className="nav-button">‹</button>
          <h3>2025년 08월</h3>
          <button className="nav-button">›</button>
        </div>
        
        <div className="calendar-grid">
          <div className="weekdays">
            {['일', '월', '화', '수', '목', '금', '토'].map(day => (
              <div key={day} className="weekday">{day}</div>
            ))}
          </div>
          <div className="dates">
            {generateCalendar().map(date => (
              <motion.button
                key={date}
                className={`date-button ${date === 15 ? 'selected' : ''} ${date === 6 ? 'today' : ''}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setFormData({ ...formData, date: `2025-08-${date.toString().padStart(2, '0')}` })}
              >
                {date}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <div className="time-range-section">
        <h3>시간 범위 선택</h3>
        <div className="range-container">
          <div className="range-labels">
            <span>{getTimeLabel(formData.timeStart)}</span>
            <span>-</span>
            <span>{getTimeLabel(formData.timeEnd)}</span>
          </div>
          <div className="range-description">
            <span>{formData.timeEnd - formData.timeStart + 1}시간 매치</span>
          </div>
          <div className="dual-range-slider">
            <div 
              className="range-track-active"
              style={{
                left: `${(formData.timeStart / 23) * 100}%`,
                width: `${((formData.timeEnd - formData.timeStart) / 23) * 100}%`
              }}
            />
            <input
              type="range"
              min="0"
              max="23"
              step="1"
              value={formData.timeStart}
              onChange={(e) => handleTimeRangeChange('start', parseInt(e.target.value))}
              className="range-input range-min"
            />
            <input
              type="range"
              min="0"
              max="23"
              step="1"
              value={formData.timeEnd}
              onChange={(e) => handleTimeRangeChange('end', parseInt(e.target.value))}
              className="range-input range-max"
            />
          </div>
        </div>
        <p className="selected-datetime">
          2025. 8. 15.(금) • {getTimeLabel(formData.timeStart)}~{getTimeLabel(formData.timeEnd)}
        </p>
      </div>

      <div className="wizard-buttons">
        <button className="prev-button" onClick={onPrev}>이전</button>
        <button className="next-button" onClick={onNext}>다음</button>
      </div>
    </motion.div>
  )
}

// Step 4: 구력 및 NTRP 선택
const Step4 = ({ formData, setFormData, onNext, onPrev }: any) => {

  const getSkillLabel = (value: number) => {
    if (value < 1) return '입문자'
    if (value < 2) return '1년차'
    if (value < 3) return '2년차'
    if (value < 4) return '3년차'
    if (value < 5) return '4년차'
    if (value < 6) return '5년차'
    return '6년 이상'
  }

  const getNtrpLabel = (value: number) => {
    if (value < 2) return '입문자'
    if (value < 3) return '초보자'
    if (value < 4) return '초급자'
    if (value < 5) return '중급자'
    if (value < 6) return '상급자'
    return '전문가'
  }

  const handleSkillRangeChange = (type: 'min' | 'max', value: number) => {
    if (type === 'min') {
      setFormData({ 
        ...formData, 
        skillMin: value, 
        skillMax: Math.max(value, formData.skillMax) 
      })
    } else {
      setFormData({ 
        ...formData, 
        skillMax: value,
        skillMin: Math.min(formData.skillMin, value)
      })
    }
  }

  const handleNtrpRangeChange = (type: 'min' | 'max', value: number) => {
    if (type === 'min') {
      setFormData({ 
        ...formData, 
        ntrpMin: value, 
        ntrpMax: Math.max(value, formData.ntrpMax) 
      })
    } else {
      setFormData({ 
        ...formData, 
        ntrpMax: value,
        ntrpMin: Math.min(formData.ntrpMin, value)
      })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="wizard-step"
    >
      <h2>원하는 실력 범위를 설정해 주세요</h2>
      
      <div className="skill-range-section">
        <h3>구력 (경력)</h3>
        <div className="range-container">
          <div className="range-labels">
            <span>{formData.skillMin}년</span>
            <span>-</span>
            <span>{formData.skillMax}년</span>
          </div>
          <div className="range-description">
            <span>{getSkillLabel(formData.skillMin)} ~ {getSkillLabel(formData.skillMax)}</span>
          </div>
          <div className="dual-range-slider">
            <div 
              className="range-track-active"
              style={{
                left: `${(formData.skillMin / 6) * 100}%`,
                width: `${((formData.skillMax - formData.skillMin) / 6) * 100}%`
              }}
            />
            <input
              type="range"
              min="0"
              max="6"
              step="1"
              value={formData.skillMin}
              onChange={(e) => handleSkillRangeChange('min', parseInt(e.target.value))}
              className="range-input range-min"
            />
            <input
              type="range"
              min="0"
              max="6"
              step="1"
              value={formData.skillMax}
              onChange={(e) => handleSkillRangeChange('max', parseInt(e.target.value))}
              className="range-input range-max"
            />
          </div>
        </div>
      </div>

      <div className="ntrp-range-section">
        <h3>NTRP (실력 지수)</h3>
        <div className="range-container">
          <div className="range-labels">
            <span>{formData.ntrpMin}</span>
            <span>-</span>
            <span>{formData.ntrpMax}</span>
          </div>
          <div className="range-description">
            <span>{getNtrpLabel(formData.ntrpMin)} ~ {getNtrpLabel(formData.ntrpMax)}</span>
          </div>
          <div className="dual-range-slider">
            <div 
              className="range-track-active"
              style={{
                left: `${((formData.ntrpMin - 1) / 6) * 100}%`,
                width: `${((formData.ntrpMax - formData.ntrpMin) / 6) * 100}%`
              }}
            />
            <input
              type="range"
              min="1"
              max="7"
              step="0.5"
              value={formData.ntrpMin}
              onChange={(e) => handleNtrpRangeChange('min', parseFloat(e.target.value))}
              className="range-input range-min"
            />
            <input
              type="range"
              min="1"
              max="7"
              step="0.5"
              value={formData.ntrpMax}
              onChange={(e) => handleNtrpRangeChange('max', parseFloat(e.target.value))}
              className="range-input range-max"
            />
          </div>
        </div>
      </div>

      <div className="wizard-buttons">
        <button className="prev-button" onClick={onPrev}>이전</button>
        <button className="next-button" onClick={onNext}>다음</button>
      </div>
    </motion.div>
  )
}

// Step 5: 게임 유형 선택
const Step5 = ({ formData, setFormData, onNext, onPrev }: any) => {
  const gameTypes = [
    { key: 'mixed', label: '혼복', icon: '👫', description: '남녀 혼성 복식' },
    { key: 'men', label: '남복', icon: '👬', description: '남성 복식' },
    { key: 'women', label: '여복', icon: '👭', description: '여성 복식' },
    { key: 'singles', label: '단식', icon: '🎾', description: '1 vs 1 경기' }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="wizard-step step5-container"
    >
      <div className="step5-header">
        <h2>게임 유형을 선택해 주세요</h2>
        <p className="step5-subtitle">원하는 테니스 게임 타입을 선택해보세요</p>
      </div>
      
      <div className="game-type-section-v2">
        <div className="game-type-grid-large">
          {gameTypes.map(type => (
            <motion.div
              key={type.key}
              className={`game-type-card-large ${formData.gameType === type.key ? 'selected' : ''}`}
              onClick={() => setFormData({ ...formData, gameType: type.key })}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="game-type-icon-large">{type.icon}</div>
              <div className="game-type-info-large">
                <h4>{type.label}</h4>
                <p>{type.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="wizard-buttons">
        <motion.button 
          className="prev-button-v2" 
          onClick={onPrev}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          이전
        </motion.button>
        <motion.button 
          className="next-button-v2" 
          onClick={onNext}
          disabled={!formData.gameType}
          whileHover={formData.gameType ? { scale: 1.02 } : {}}
          whileTap={formData.gameType ? { scale: 0.98 } : {}}
        >
          다음
        </motion.button>
      </div>
    </motion.div>
  )
}

// Step 6: 모집 인원 선택
const Step6 = ({ formData, setFormData, onPrev, onSubmit }: any) => {
  const adjustCount = (gender: 'male' | 'female', change: number) => {
    const key = gender === 'male' ? 'maleGuests' : 'femaleGuests'
    const newValue = Math.max(0, Math.min(10, formData[key] + change))
    setFormData({ ...formData, [key]: newValue })
  }

  const totalParticipants = formData.maleGuests + formData.femaleGuests

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="wizard-step step6-container"
    >
      <div className="step6-header">
        <h2>모집 인원을 설정해 주세요</h2>
        <p className="step6-subtitle">함께 테니스를 즐길 참가자 수를 정해보세요</p>
      </div>

      <div className="participants-section-v2">
        <div className="participants-grid">
          <div className="participant-card male">
            <div className="participant-header">
              <div className="participant-icon">👨</div>
              <div className="participant-info">
                <h4>남성</h4>
                <p>남성 참가자</p>
              </div>
            </div>
            <div className="counter-v2">
              <motion.button 
                className="counter-btn-v2 minus"
                onClick={() => adjustCount('male', -1)}
                disabled={formData.maleGuests <= 0}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                −
              </motion.button>
              <div className="counter-display">
                <span className="counter-value-v2">{formData.maleGuests}</span>
                <span className="counter-label">명</span>
              </div>
              <motion.button 
                className="counter-btn-v2 plus"
                onClick={() => adjustCount('male', 1)}
                disabled={formData.maleGuests >= 10}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                +
              </motion.button>
            </div>
          </div>

          <div className="participant-card female">
            <div className="participant-header">
              <div className="participant-icon">👩</div>
              <div className="participant-info">
                <h4>여성</h4>
                <p>여성 참가자</p>
              </div>
            </div>
            <div className="counter-v2">
              <motion.button 
                className="counter-btn-v2 minus"
                onClick={() => adjustCount('female', -1)}
                disabled={formData.femaleGuests <= 0}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                −
              </motion.button>
              <div className="counter-display">
                <span className="counter-value-v2">{formData.femaleGuests}</span>
                <span className="counter-label">명</span>
              </div>
              <motion.button 
                className="counter-btn-v2 plus"
                onClick={() => adjustCount('female', 1)}
                disabled={formData.femaleGuests >= 10}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                +
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="total-participants-v2">
        <div className="total-card">
          <div className="total-header">
            <span className="total-icon">👥</span>
            <h3>총 모집 인원</h3>
          </div>
          <div className="total-count">
            <span className="total-number">{totalParticipants}</span>
            <span className="total-unit">명</span>
          </div>
          <div className="total-breakdown">
            <span className="breakdown-item male">남성 {formData.maleGuests}명</span>
            <span className="breakdown-divider">•</span>
            <span className="breakdown-item female">여성 {formData.femaleGuests}명</span>
          </div>
        </div>
      </div>

      <div className="wizard-buttons">
        <motion.button 
          className="prev-button-v2" 
          onClick={onPrev}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          이전
        </motion.button>
        <motion.button 
          className="submit-button-v2" 
          onClick={onSubmit}
          disabled={totalParticipants === 0}
          whileHover={totalParticipants > 0 ? { scale: 1.02 } : {}}
          whileTap={totalParticipants > 0 ? { scale: 0.98 } : {}}
        >
          <span className="submit-icon">🚀</span>
          매칭 생성
        </motion.button>
      </div>
    </motion.div>
  )
}

export default CreatePage