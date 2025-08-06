import { motion } from 'framer-motion'

const BoardPage = () => {
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
          📋 게시판
        </motion.h1>
      </div>
      
      <div className="page-content">
        <motion.div
          className="board-tabs"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="tab-list">
            <button className="tab-button active">전체</button>
            <button className="tab-button">팁 공유</button>
            <button className="tab-button">장비 리뷰</button>
            <button className="tab-button">자유게시판</button>
          </div>
        </motion.div>
        
        <motion.div
          className="post-list"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div
            className="post-item"
            whileHover={{ x: 5 }}
          >
            <div className="post-content">
              <h3>백핸드 스트로크 개선 팁</h3>
              <p>초보자를 위한 백핸드 향상 방법을 공유합니다...</p>
              <div className="post-meta">
                <span className="author">테니스마스터</span>
                <span className="time">2시간 전</span>
                <span className="comments">댓글 12</span>
              </div>
            </div>
            <div className="post-stats">
              <span className="likes">👍 24</span>
            </div>
          </motion.div>
          
          <motion.div
            className="post-item"
            whileHover={{ x: 5 }}
          >
            <div className="post-content">
              <h3>윌슨 프로스태프 97 리뷰</h3>
              <p>한 달간 사용해본 솔직한 후기입니다...</p>
              <div className="post-meta">
                <span className="author">라켓리뷰어</span>
                <span className="time">5시간 전</span>
                <span className="comments">댓글 8</span>
              </div>
            </div>
            <div className="post-stats">
              <span className="likes">👍 15</span>
            </div>
          </motion.div>
          
          <motion.div
            className="post-item"
            whileHover={{ x: 5 }}
          >
            <div className="post-content">
              <h3>강남 테니스 클럽 추천</h3>
              <p>초보자도 환영하는 분위기 좋은 클럽입니다...</p>
              <div className="post-meta">
                <span className="author">강남거주자</span>
                <span className="time">1일 전</span>
                <span className="comments">댓글 20</span>
              </div>
            </div>
            <div className="post-stats">
              <span className="likes">👍 32</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default BoardPage