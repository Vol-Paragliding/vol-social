import { useContext } from 'react'
import { ParamUserContext } from './ParamUserContext'

export const useParamUser = () => {
  const context = useContext(ParamUserContext)

  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }

  return context
}
