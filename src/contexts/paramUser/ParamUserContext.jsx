import React, { createContext, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useStreamContext } from 'react-activity-feed'

export const ParamUserContext = createContext(null)

export const ParamUserProvider = ({ children }) => {
  const { userId } = useParams()
  const { client } = useStreamContext()
  const [paramUser, setParamUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const getUser = async () => {
      if (!userId) return

      try {
        const paramUser = await client
          .user(userId)
          .get({ with_follow_counts: true })
        setParamUser(paramUser.full)
      } catch (error) {
        console.error('Error fetching paramUser:', error)
        setError('Error fetching paramUser')
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, [client, userId])

  const updateParamUser = (updatedUser) => {
    setParamUser(updatedUser)
  }

  return (
    <ParamUserContext.Provider
      value={{ paramUser, loading, error, updateParamUser }}
    >
      {children}
    </ParamUserContext.Provider>
  )
}
