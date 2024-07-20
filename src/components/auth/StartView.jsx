import React, { useState } from 'react'
import { useAuth } from '../../contexts/auth/useAuth'
import { googleLogin } from '../../contexts/auth/AuthSlice'
import { useNavigate } from 'react-router-dom'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'

import LoginView from './LoginView'
import SignUpView from './SignUpView'
import appIcon from '../../assets/appIcon.png'
import styles from './auth.module.css'

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID

const StartView = () => {
  const { dispatch } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [isLoginPresented, setIsLoginPresented] = useState(false)
  const [isSignUpPresented, setIsSignUpPresented] = useState(false)

  const handleLoginPress = () => setIsLoginPresented(true)
  const handleSignUpPress = () => setIsSignUpPresented(true)
  const handleClose = () => {
    setIsLoginPresented(false)
    setIsSignUpPresented(false)
  }

  const handleGoogleLoginSuccess = async (response) => {
    console.log('Google login response:', response)
    try {
      const tokenId = response.credential
      const decoded = jwtDecode(tokenId)
      console.log('Google login success:', decoded)
      const data = await googleLogin(tokenId)
      console.log('Google login data:', data)
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
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <main className={styles.startContainer}>
        <section className={styles.startContent}>
          {!isLoginPresented && !isSignUpPresented && (
            <div className={styles.authFormContainer}>
              <img
                className={styles.logo}
                src={appIcon}
                alt="Paragliding logo"
              />
              <h1 className={styles.authFormTitle}>
                Explore the paragliding world
              </h1>
              <div className={styles.authFormHeader}>
                <h2>Share adventures</h2>
              </div>
              <div className={styles.startActionContainer}>
                <button
                  className={`${styles.createLoginButton} ${styles.firstCreateLoginButton}`}
                  onClick={handleSignUpPress}
                >
                  Create account
                </button>
                <div className={styles.orSeparator}>
                  Already have an account?
                </div>
                <button
                  className={styles.createLoginButton}
                  onClick={handleLoginPress}
                >
                  Sign In
                </button>
                <div className={styles.orSeparator}>or</div>
                {error && <div className={styles.errorMessage}>{error}</div>}
                <div className={styles.googleLoginButton}>
                  <GoogleLogin
                    onSuccess={handleGoogleLoginSuccess}
                    onError={handleGoogleLoginFailure}
                  />
                </div>
              </div>
            </div>
          )}
          {isLoginPresented && <LoginView onClose={handleClose} />}
          {isSignUpPresented && <SignUpView onClose={handleClose} />}
        </section>
      </main>
    </GoogleOAuthProvider>
  )
}

export default StartView
