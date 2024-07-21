import { v4 as uuidv4 } from 'uuid'

import { API_ENDPOINT } from '../../config'

export const initialState = {
  authUser: null,
  isAuthenticated: false,
  loading: false,
  error: null,
}

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_USER':
      if (!action.payload) {
        return {
          ...state,
          authUser: null,
          isAuthenticated: false,
          feedToken: null,
          chatToken: null,
        }
      }
      const user = action.payload.user ? action.payload.user : action.payload
      return {
        ...state,
        authUser: {
          ...state.authUser,
          user,
          feedToken: action.payload.feedToken,
          chatToken: action.payload.chatToken,
        },
        isAuthenticated: !!user,
      }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    default:
      return state
  }
}

export async function googleLogin(tokenId) {
  const response = await fetch(`${API_ENDPOINT}/auth/google`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tokenId }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Failed to log in with Google')
  }

  return data
}

export async function login({ username, password }) {
  const response = await fetch(`${API_ENDPOINT}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Failed to log in')
  }

  return {
    user: data.user,
    feedToken: data.feedToken,
    chatToken: data.chatToken,
  }
}

export async function signup({ username, password, email }) {
  const userId = username.toLowerCase();
  const id = uuidv4().replace(/-/g, '').slice(0, 21)

  const response = await fetch(`${API_ENDPOINT}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password, email, userId, id }),
  })

  const data = await response.json()

  if (!response.ok) {
    if (data.message && data.message.code === 'SQLITE_CONSTRAINT') {
      throw new Error('Username already exists. Please choose a different one.')
    } else if (response.status === 409) {
      throw new Error(
        'User with given ID already exists. Please choose a different one.'
      )
    } else {
      throw new Error(data.message || 'Failed to sign up')
    }
  }

  return {
    user: data.user,
    feedToken: data.feedToken,
    chatToken: data.chatToken,
  }
}

export function logout(dispatch) {
  dispatch({ type: 'SET_USER', payload: null })
  sessionStorage.removeItem('authUser')
}
