import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'

interface AnimatedLayoutProps {
  children: React.ReactNode
}

const pageVariants = {
  initial: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.95
  }),
  in: {
    x: 0,
    opacity: 1,
    scale: 1
  },
  out: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    scale: 0.95
  })
}

const pageTransition = {
  type: "tween" as const,
  ease: "anticipate" as const,
  duration: 0.4
}

const AnimatedLayout = ({ children }: AnimatedLayoutProps) => {
  const location = useLocation()
  
  // 이전 경로를 저장하기 위한 로직 (향후 구현 예정)
  const direction = 1 // 기본값, 실제로는 이전 경로와 비교해서 계산

  return (
    <div className="page-container">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={location.pathname}
          custom={direction}
          variants={pageVariants}
          initial="initial"
          animate="in"
          exit="out"
          transition={pageTransition}
          className="animated-page"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default AnimatedLayout