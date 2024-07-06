import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/auth/useAuth'
import { ParamUserProvider } from '../contexts/paramUser/ParamUserContext'
import StartView from '../components/auth/StartView'
import HomeContent from '../components/homeContent/HomeContent'
import Layout from '../components/layout/Layout'
import NotificationContent from '../components/notifications/NotificationContent'
import ProfileContent from '../components/profile/ProfileContent'
import Thread from '../components/thread/Thread'

export default function AppRoutes() {
  const { authState } = useAuth()

  if (!authState.isAuthenticated) {
    return <StartView />
  }

  return (
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
              <ParamUserProvider>
                <ProfileContent />
              </ParamUserProvider>
            </Layout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/:userId/status/:id"
        element={
          authState.isAuthenticated ? (
            <Layout>
              <Thread />
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
  )
}
