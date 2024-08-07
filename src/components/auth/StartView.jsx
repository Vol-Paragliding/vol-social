import { useState } from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'

import LoginView from './LoginView'
import SignUpView from './SignUpView'
import GoogleSignInButton from './GoogleSignInButton'
import appIcon from '../../assets/appIcon.png'
import styles from './auth.module.css'

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID

const StartView = () => {
  const [isLoginPresented, setIsLoginPresented] = useState(false)
  const [isSignUpPresented, setIsSignUpPresented] = useState(false)

  const handleLoginPress = () => setIsLoginPresented(true)
  const handleSignUpPress = () => setIsSignUpPresented(true)
  const handleClose = () => {
    setIsLoginPresented(false)
    setIsSignUpPresented(false)
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
                <h2>Share in the adventures</h2>
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
                <GoogleSignInButton
                  className={styles.googleLoginButton}
                  useOneTap
                />
              </div>
            </div>
          )}
          {isLoginPresented && <LoginView onClose={handleClose} />}
          {isSignUpPresented && <SignUpView onClose={handleClose} />}
        </section>
      </main>
      <footer className={styles.footer}>
        <div>
          <a className={styles.aboutLink} href="/">
            &copy; 2024 Vol
          </a>
          <a className={styles.aboutLink} href="/home.html">
            Home
          </a>
          <a className={styles.aboutLink} href="/privacy-policy.html">
            Privacy Policy
          </a>
          <a className={styles.aboutLink} href="/terms-of-service.html">
            Terms of Service
          </a>
        </div>
      </footer>
    </GoogleOAuthProvider>
  )
}

export default StartView
