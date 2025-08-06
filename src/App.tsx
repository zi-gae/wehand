import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import BottomNavigation from './components/BottomNavigation'
import AnimatedLayout from './components/AnimatedLayout'
import HomePage from './pages/HomePage'
import MatchingPage from './pages/MatchingPage'
import CreatePage from './pages/CreatePage'
import BoardPage from './pages/BoardPage'
import ProfilePage from './pages/ProfilePage'
import MatchDetailPage from './pages/MatchDetailPage'
import NotificationPage from './pages/NotificationPage'
import ChatListPage from './pages/ChatListPage'
import ChatRoomPage from './pages/ChatRoomPage'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="app">
          <main className="main-content">
            <Routes>
              <Route path="/" element={
                <AnimatedLayout>
                  <HomePage />
                </AnimatedLayout>
              } />
              <Route path="/matching" element={
                <AnimatedLayout>
                  <MatchingPage />
                </AnimatedLayout>
              } />
              <Route path="/matching/:id" element={
                <AnimatedLayout>
                  <MatchDetailPage />
                </AnimatedLayout>
              } />
              <Route path="/create" element={
                <AnimatedLayout>
                  <CreatePage />
                </AnimatedLayout>
              } />
              <Route path="/board" element={
                <AnimatedLayout>
                  <BoardPage />
                </AnimatedLayout>
              } />
              <Route path="/profile" element={
                <AnimatedLayout>
                  <ProfilePage />
                </AnimatedLayout>
              } />
              <Route path="/notifications" element={
                <AnimatedLayout>
                  <NotificationPage />
                </AnimatedLayout>
              } />
              <Route path="/chat" element={
                <AnimatedLayout>
                  <ChatListPage />
                </AnimatedLayout>
              } />
              <Route path="/chat/:roomId" element={
                <AnimatedLayout>
                  <ChatRoomPage />
                </AnimatedLayout>
              } />
            </Routes>
          </main>
          <BottomNavigation />
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App