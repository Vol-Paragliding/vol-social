import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import { StreamApp } from 'react-activity-feed'

import { useAuth } from './contexts/auth/useAuth'
import { ChatProvider } from './contexts/chat/ChatContext'
import { FeedProvider } from './contexts/feed/FeedContext'
import StartView from './components/auth/StartView'
import HomeContent from './components/homeContent/HomeContent'
import Layout from './components/layout/Layout'
import NotificationContent from './components/notifications/NotificationContent'
import ProfileContent from './components/profile/ProfileContent'
import ThreadContent from './components/thread/ThreadContent'
import ScrollToTop from './components/ScrollToTop'

const APP_ID = process.env.REACT_APP_STREAM_APP_ID
const API_KEY = process.env.REACT_APP_API_KEY

// Polyfill for process.env
window.process = {
  env: {
    NODE_ENV: process.env.NODE_ENV,
  },
}

export default function App() {
  const { authState } = useAuth()
  // console.log('App authState', authState)

  if (!authState.isAuthenticated) {
    return (
      <Router>
        <StartView />
      </Router>
    )
  }

  return (
    <StreamApp
      token={authState.authUser.feedToken}
      appId={APP_ID}
      apiKey={API_KEY}
    >
      <ChatProvider>
        <FeedProvider>
          <Router>
            <ScrollToTop />
            <Routes>
              <Route
                path="/"
                element={
                  !authState.isAuthenticated ? (
                    <StartView />
                  ) : (
                    <Navigate to="/home" replace />
                  )
                }
              />
              <Route
                path="/home"
                element={
                  authState.isAuthenticated ? (
                    <Layout>
                      <HomeContent />
                    </Layout>
                  ) : (
                    <Navigate to="/" replace />
                  )
                }
              />
              <Route
                path="/:userId"
                element={
                  authState.isAuthenticated ? (
                    <Layout>
                      <ProfileContent />
                    </Layout>
                  ) : (
                    <Navigate to="/" replace />
                  )
                }
              />
              <Route
                path="/thread/:userId/status/:id"
                element={
                  authState.isAuthenticated ? (
                    <Layout>
                      <ThreadContent />
                    </Layout>
                  ) : (
                    <Navigate to="/" replace />
                  )
                }
              />
              <Route
                path="/notifications"
                element={
                  authState.isAuthenticated ? (
                    <Layout>
                      <NotificationContent />
                    </Layout>
                  ) : (
                    <Navigate to="/" replace />
                  )
                }
              />
            </Routes>
          </Router>
        </FeedProvider>
      </ChatProvider>
    </StreamApp>
  )
}
