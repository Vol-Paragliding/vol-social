import React, { useState } from 'react'
import { useAuth } from '../../contexts/auth/useAuth'
import { googleLogin } from '../../contexts/auth/AuthSlice'
import { useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'

const GoogleSignInButton = ({ className, useOneTap }) => {
  const { dispatch } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  const handleGoogleLoginSuccess = async (response) => {
    try {
      const tokenId = response.credential
      const data = await googleLogin(tokenId)
      dispatch({ type: 'SET_USER', payload: data })
      navigate('/home')
    } catch (error) {
      console.error('Google login error:', error)
      setError(error.message)
    }
  }

  const handleGoogleLoginFailure = (error) => {
    console.error('Google login failure:', error)
    setError('Failed to log in with Google')
  }

  return (
    <>
      {error && <div className={className}>{error}</div>}
      <GoogleLogin
        onSuccess={handleGoogleLoginSuccess}
        onError={handleGoogleLoginFailure}
        useOneTap={useOneTap}
        width="334px"
        shape="pill"
        className={className}
      />
    </>
  )
}

export default GoogleSignInButton
