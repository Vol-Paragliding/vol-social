import { checkAvailability } from '../contexts/auth/AuthSlice'

export const handleAvailabilityCheck = async (
  identifier,
  type,
  authState,
  setError,
  setAvailable
) => {
  if (
    (type === 'email' && identifier !== authState.authUser?.user.email) ||
    (type === 'username' && identifier !== authState.authUser?.user.username)
  ) {
    try {
      const isAvailable = await checkAvailability(identifier)
      if (!isAvailable) {
        if (type === 'email') {
          setError('Email is already in use')
        } else {
          setError('Username is already in use')
        }
      } else {
        setError('')
      }
      setAvailable(isAvailable)
      return isAvailable
    } catch (error) {
      console.error(`Error checking ${type} availability: `, error)
      setError(`Error checking ${type} availability`)
      setAvailable(false)
      return false
    }
  }
  return true
}
