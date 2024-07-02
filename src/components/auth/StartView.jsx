import { useState } from 'react'

import LoginView from './LoginView'
import SignUpView from './SignUpView'
import appIcon from '../../assets/appIcon.png'
import styles from './auth.module.css'

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
    <main className={styles.startContainer}>
      <section className={styles.startContent}>
        {!isLoginPresented && !isSignUpPresented && (
          <div className={styles.authFormContainer}>
            <img className={styles.logo} src={appIcon} alt="Paragliding logo" />
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
              <div className={styles.orSeparator}>Already have an account?</div>
              <button
                className={styles.createLoginButton}
                onClick={handleLoginPress}
              >
                Sign In
              </button>
            </div>
          </div>
        )}
        {isLoginPresented && <LoginView onClose={handleClose} />}
        {isSignUpPresented && <SignUpView onClose={handleClose} />}
      </section>
    </main>
  )
}

export default StartView
