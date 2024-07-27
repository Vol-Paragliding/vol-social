import { nanoid } from 'nanoid'
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

export async function checkAvailability(identifier) {
  const response = await fetch(`${API_ENDPOINT}/auth/check-availability`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ identifier }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Failed to check availability')
  }

  return data
}

export async function getIdByUsername(username) {
  const response = await fetch(`${API_ENDPOINT}/auth/get-user-id`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Failed to get user ID')
  }

  return data.userId
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

  return {
    user: data.user,
    feedToken: data.feedToken,
    chatToken: data.chatToken,
  }
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

export async function signup({
  identifier,
  password,
  username,
  name,
  profile,
}) {
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)
  const id = nanoid()
  const userId = isEmail ? id : identifier.toLowerCase()
  const email = isEmail ? identifier.toLowerCase() : ''

  const response = await fetch(`${API_ENDPOINT}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      identifier,
      password,
      email,
      userId,
      id,
      username,
      name,
      profile,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    if (data.message && data.message.code === 'SQLITE_CONSTRAINT') {
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

export async function updateProfile(profileData, feedToken) {
  const response = await fetch(`${API_ENDPOINT}/auth/update-profile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${feedToken}`,
    },
    body: JSON.stringify(profileData),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Failed to update profile')
  }

  return data.user
}

export async function logout(dispatch) {
  console.log('Logout start 2')
  dispatch({ type: 'SET_USER', payload: null })
  sessionStorage.removeItem('authUser')
  console.log('Logout end 3')
}
