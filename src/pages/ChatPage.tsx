import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const ChatPage = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // /chat 경로로 접근하면 자동으로 채팅 목록 페이지로 이동
    navigate('/chat/list', { replace: true })
  }, [navigate])

  return null
}

export default ChatPage