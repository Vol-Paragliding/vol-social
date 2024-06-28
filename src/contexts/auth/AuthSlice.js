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
      return {
        ...state,
        authUser: action.payload,
        isAuthenticated: !!action.payload,
      }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    default:
      return state
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
console.log('data',data)
  return data
}

// export async function signup({ username, password }) {
//   const response = await fetch(`${API_ENDPOINT}/auth/delete`, {
//     method: 'DELETE',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ username }),
//   });

//   if (!response.ok) {
//     const data = await response.json();
//     throw new Error(data.message || 'Failed to delete user');
//   }

//   return true;
// }

export async function signup({ username, password }) {
  const response = await fetch(`${API_ENDPOINT}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })

  const data = await response.json()

  if (!response.ok) {
    if (data.message && data.message.code === 'SQLITE_CONSTRAINT') {
      throw new Error('Username already exists. Please choose a different one.')
    } else {
      throw new Error(data.message || 'Failed to sign up')
    }
  }

  return data
}

export function logout(dispatch) {
  dispatch({ type: 'SET_USER', payload: null })
  sessionStorage.removeItem('authUser')
}
