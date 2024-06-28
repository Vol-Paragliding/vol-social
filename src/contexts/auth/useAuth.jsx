import { useContext } from 'react'

import { AuthContext } from './AuthContext'

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  const { authState, dispatch } = context
  console.log('authState', authState, 'dispatch', dispatch)
  return { authState, dispatch }
}
