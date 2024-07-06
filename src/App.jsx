import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { StreamApp } from 'react-activity-feed'
import { useAuth } from './contexts/auth/useAuth'
import { ChatProvider } from './contexts/chat/ChatContext'
import { FeedProvider } from './contexts/feed/FeedContext'
import AppRoutes from './routes/AppRoutes'
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

  if (!authState.isAuthenticated) {
    return (
      <Router>
        <AppRoutes />
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
            <AppRoutes />
          </Router>
        </FeedProvider>
      </ChatProvider>
    </StreamApp>
  )
}
