import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useStreamContext } from 'react-activity-feed'
import { logout } from '../../contexts/auth/AuthSlice'
import { useAuth } from '../../contexts/auth/useAuth'
import { API_ENDPOINT } from '../../config'

const MenuContainer = styled.div`
  position: absolute;
  background-color: #222;
  border: 1px solid #333;
  border-radius: 5px;
  right: 10px;
  top: 40px;
  z-index: 10;
  width: 150px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);

  .menu-item {
    padding: 10px;
    cursor: pointer;
    color: white;
    text-align: center;
    border-bottom: 1px solid #333;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background-color: #444;
    }
  }
`

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20;
`

const ConfirmContainer = styled.div`
  background: #222;
  border: 1px solid #333;
  border-radius: 5px;
  padding: 20px;
  width: 300px;
  text-align: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);

  .message {
    color: white;
    margin-bottom: 20px;
  }

  .buttons {
    display: flex;
    justify-content: space-between;

    button {
      background: #444;
      border: none;
      color: white;
      padding: 10px 20px;
      cursor: pointer;
      border-radius: 5px;

      &:hover {
        background: #555;
      }
    }

    .confirm {
      background: var(--theme-color);
      color: black;

      &:hover {
        background: var(--faded-theme-color);
      }
    }
  }
`

export default function ProfileMoreMenu({ onClose }) {
  const navigate = useNavigate()
  const { client } = useStreamContext()
  const { dispatch } = useAuth()
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleDeleteAccount = () => {
    setIsConfirmDeleteOpen(true)
  }

  const handleConfirmDelete = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(
        `${API_ENDPOINT}/auth/user/${client.userId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${client.userToken}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to delete account')
      }

      logout(dispatch)
      navigate('/')
      console.log('Account deleted')

      setIsConfirmDeleteOpen(false)
      onClose()
    } catch (error) {
      console.error('Error deleting account:', error)
    }
  }

  return (
    <>
      <MenuContainer>
        <div className="menu-item" onClick={handleDeleteAccount}>
          Delete Account
        </div>
      </MenuContainer>
      {isConfirmDeleteOpen && (
        <Overlay>
          <ConfirmContainer>
            <div className="message">
              Are you sure you want to delete your account? This action cannot
              be undone.
            </div>
            <div className="buttons">
              <button className="confirm" onClick={handleConfirmDelete}>
                {isLoading ? 'Deleting...' : 'Confirm'}
              </button>
              <button
                className="cancel"
                onClick={() => setIsConfirmDeleteOpen(false)}
              >
                Cancel
              </button>
            </div>
          </ConfirmContainer>
        </Overlay>
      )}
    </>
  )
}
