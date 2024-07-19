import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../../contexts/auth/useAuth'
import { login } from '../../contexts/auth/AuthSlice'
import appIcon from '../../assets/appIcon.png'
import styles from './auth.module.css'

const LogInView = ({ onClose }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { dispatch } = useAuth()
  const navigate = useNavigate()

  const usernameRef = useRef(null)

  useEffect(() => {
    if (usernameRef.current) {
      usernameRef.current.focus()
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    setError('')

    try {
      const user = await login({ username, password })

      dispatch({ type: 'SET_USER', payload: user })
      navigate('/home')
    } catch (error) {
      console.error('Login Error:', error)
      setError(error.message || 'An error occurred during login.')
    }
  }

  return (
    <div className={styles.authFormContainer}>
      <button className={styles.authCloseButton} onClick={onClose}>
        &times;
      </button>
      <img className={styles.logo} src={appIcon} alt="Paragliding logo" />
      <h1 className={styles.authFormTitle}>Log in to Vol</h1>
      <div className={styles.credentialsForm}>
        <form onSubmit={handleLogin}>
          {error && <div className={styles.signupError}>{error}</div>}
          <div className={styles.authFormHeader}>
            <h2>Enter your login credentials</h2>
          </div>
          <div className={styles.authInputGroup}>
            <input
              ref={usernameRef}
              type="text"
              placeholder="Your username"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              autoComplete="username"
              pattern="^[a-zA-Z0-9_.\-]{3,25}$"
              title="Username must be 3-25 characters and can include letters, numbers, underscores, hyphens, and periods."
              required
            />
          </div>
          <div className={styles.authInputGroup}>
            <input
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          <button type="submit" className={styles.createLoginButton}>
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}

export default LogInView
