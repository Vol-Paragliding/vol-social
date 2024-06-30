import { createContext, useReducer, useEffect } from 'react'

import { initialState, authReducer } from './AuthSlice'

export const AuthContext = createContext({
  authState: initialState,
  dispatch: () => null,
})

export const AuthProvider = ({ children }) => {
  const [authState, dispatch] = useReducer(authReducer, initialState, () => {
    const storedUser = sessionStorage.getItem('authUser')
    const user = storedUser ? JSON.parse(storedUser) : null

    return {
      ...initialState,
      authUser: user,
      isAuthenticated: !!user,
    }
  })

  useEffect(() => {
    if (authState.authUser) {
      sessionStorage.setItem('authUser', JSON.stringify(authState.authUser))
    } else {
      sessionStorage.removeItem('authUser')
    }
  }, [authState.authUser])

  return (
    <AuthContext.Provider value={{ authState, dispatch }}>
      {children}
    </AuthContext.Provider>
  )
}
