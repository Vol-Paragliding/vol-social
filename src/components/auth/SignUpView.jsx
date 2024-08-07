import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { sanitizeInput } from '../utils'
import { useAuth } from '../../contexts/auth/useAuth'
import { signup, checkAvailability } from '../../contexts/auth/AuthSlice'
import appIcon from '../../assets/appIcon.png'
import styles from './auth.module.css'

const SignUpView = ({ onClose }) => {
  const [step, setStep] = useState(1)
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState('')
  const [username, setUsername] = useState('')
  const [isAvailable, setIsAvailable] = useState(true)
  const [loading, setLoading] = useState(false)
  const { dispatch } = useAuth()
  const navigate = useNavigate()

  const identifierRef = useRef(null)
  const displayNameRef = useRef(null)
  const usernameRef = useRef(null)

  useEffect(() => {
    if (identifierRef.current) {
      identifierRef.current.focus()
    }
  }, [])

  const handleCheckAvailability = async (identifier) => {
    try {
      const result = await checkAvailability(identifier)
      const available =
        result.message === 'Email available' ||
        result.message === 'Username available'
      if (available) {
        setError('')
      }
      setIsAvailable(available)
      return available
    } catch (error) {
      console.error('Availability Check Error:', error)
      setError(
        error.message || 'An error occurred while checking availability.'
      )
      setIsAvailable(false)
      return false
    }
  }

  const handleNext = async (event) => {
    event.preventDefault()
    setError('')

    const { sanitized: sanitizedIdentifier, error: identifierValidationError } =
      sanitizeInput(identifier)

    if (identifierValidationError) {
      setError(identifierValidationError)
      return
    }

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)

    if (isEmail) {
      const available = await handleCheckAvailability(sanitizedIdentifier)
      if (!available) return
      setStep(2)
    } else {
      const available = await handleCheckAvailability(sanitizedIdentifier)
      if (!available) return
      setStep(3)
    }
  }

  const handleSignUp = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const user = await signup({
        identifier: identifier.toLowerCase(), // lowercase or no?
        password,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)
          ? identifier.toLowerCase()
          : '',
        username: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)
          ? username
          : identifier.toLowerCase(),
        name: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier) ? displayName : '',
      })

      setLoading(false)
      dispatch({ type: 'SET_USER', payload: user })
      navigate('/home')
    } catch (error) {
      console.error('Sign Up Error:', error)
      setError(error.message || 'An error occurred during sign up.')
    }
  }

  const handleIdentifierChange = (e) => {
    setIdentifier(e.target.value)
    setIsAvailable(true)
  }

  const handleDisplayNameChange = (e) => {
    setDisplayName(e.target.value)
  }

  const handleUsernameChange = (e) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9_.-]/g, '')
    setUsername(value)
    setIsAvailable(true)
  }

  const handleIdentifierBlur = async (field) => {
    if (field) {
      await handleCheckAvailability(field)
    }
  }

  const handleBack = () => {
    if (step === 1) {
      onClose()
    } else if (step === 2 || step === 3) {
      setStep(1)
    }
    setError('')
  }

  return (
    <div className={styles.authFormContainer}>
      <button className={styles.authCloseButton} onClick={onClose}>
        &times;
      </button>
      <img className={styles.logo} src={appIcon} alt="Paragliding logo" />
      <h1 className={styles.authFormTitle}>Sign up</h1>
      <div className={styles.credentialsForm}>
        {step === 1 && (
          <form onSubmit={handleNext}>
            <div className={styles.authFormHeader}>
              <h2>Create your account</h2>
            </div>
            <div className={styles.signupError}>
              {error || <div className={styles.emptyErrorPlaceholder}></div>}
            </div>
            <div className={styles.authInputGroup}>
              <input
                ref={identifierRef}
                type="text"
                placeholder="Username or Email"
                value={identifier}
                onChange={handleIdentifierChange}
                pattern="^[a-z0-9_.\-@]{3,25}$"
                title="Username must be 3-25 characters and can include letters, numbers, underscores, hyphens, periods. Email must be proper format."
                style={{ color: isAvailable ? 'black' : 'red' }}
                required
                onBlur={() => handleIdentifierBlur(identifier)}
                onFocus={() => setIsAvailable(true)}
              />
            </div>
            <button
              type="submit"
              className={`${styles.createLoginButton} ${styles.authButtonBottom}`}
            >
              Next
            </button>
            <button
              type="button"
              className={`${styles.backButton}`}
              onClick={handleBack}
            >
              Back
            </button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleSignUp}>
            <div className={styles.authFormHeader}>
              <h2>Add your details</h2>
            </div>
            <div className={styles.signupError}>
              {error && <div className={styles.signupError}>{error}</div>}
            </div>
            <div className={styles.authInputGroup}>
              <input
                ref={displayNameRef}
                type="text"
                placeholder="Display Name"
                value={displayName}
                onChange={handleDisplayNameChange}
                required
                autoFocus
                pattern="^[a-zA-Z0-9_.\- ]{3,25}$"
              />
            </div>
            <div className={styles.authInputGroup}>
              <input
                ref={usernameRef}
                type="text"
                placeholder="Username"
                value={username}
                onChange={handleUsernameChange}
                onBlur={() => handleIdentifierBlur(username)}
                onFocus={() => setIsAvailable(true)}
                pattern="^[a-z0-9_.\-]{3,25}$"
                title="Username must be 3-25 characters and can include lowercase letters, numbers, underscores, hyphens, and periods."
                style={{ color: isAvailable ? 'black' : 'red' }}
                required
              />
            </div>
            <div className={styles.authInputGroup}>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                pattern=".{8,}"
                title="Password must be at least 9 characters long."
                required
              />
            </div>
            <button type="submit" className={`${styles.createLoginButton}`}>
              Sign Up
            </button>
            <button
              type="button"
              className={`${styles.backButton}`}
              onClick={handleBack}
            >
              Back
            </button>
          </form>
        )}
        {step === 3 && (
          <form onSubmit={handleSignUp}>
            <div className={styles.authFormHeader}>
              <h2>Create a password</h2>
            </div>
            <div className={styles.signupError}>
              {error || <div className={styles.emptyErrorPlaceholder}></div>}
            </div>
            <div className={styles.authInputGroup}>
              <input
                ref={usernameRef}
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                pattern=".{8,}"
                title="Password must be at least 8 characters long."
                required
                autoFocus
              />
            </div>
            <button
              type="submit"
              className={`${styles.createLoginButton} ${styles.authButtonBottom}`}
            >
              {!loading ? 'Sign Up' : 'Loading...'}
            </button>
            <button
              type="button"
              className={`${styles.backButton}`}
              onClick={handleBack}
            >
              Back
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default SignUpView
