import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react'
import { connect } from 'getstream'

import { useAuth } from '../auth/useAuth'

const apiKey = process.env.REACT_APP_API_KEY
const appId = process.env.REACT_APP_STREAM_APP_ID

export const FeedContext = createContext(null)

export const FeedProvider = ({ children }) => {
  const { authState } = useAuth()
  const [feedUser, setFeedUser] = useState(null)
  const [feedClient, setFeedClient] = useState(null)
  const [viewMode, setViewMode] = useState('')
  const [userActivities, setUserActivities] = useState([])

  useEffect(() => {
    if (authState.isAuthenticated && authState.authUser && !feedClient) {
      const client = connect(apiKey, authState.authUser.feedToken, appId)
      const userFeed = client.feed('user', authState.authUser.user.id)

      setFeedClient(userFeed)

      const fetchInitialData = async () => {
        try {
          if (!authState.authUser) return
          const userResponse = await client
            .user(authState.authUser.user.id)
            .get()
          setFeedUser(userResponse)

          const activityResponse = await userFeed.get({ limit: 10 })
          const activities = activityResponse.results
          setUserActivities(activities)
        } catch (error) {
          console.error('Error fetching user and activities: ', error)
        }
      }

      fetchInitialData()
    }
  }, [authState, feedClient])

  const addActivity = useCallback(
    async (newActivity) => {
      if (!feedClient) return
      try {
        const postActivity = await feedClient.addActivity(newActivity)
        setUserActivities((prevActivities) => [postActivity, ...prevActivities])
      } catch (error) {
        console.error('Error adding activity: ', error)
        throw error
      }
    },
    [feedClient]
  )

  const getActivities = useCallback(async () => {
    if (!feedClient) return
    try {
      const response = await feedClient.get({ limit: 10 })
      const activities = response.results
      setUserActivities(activities)
    } catch (error) {
      console.error('Error fetching user activities: ', error)
      throw error
    }
  }, [feedClient])

  const contextValue = useMemo(
    () => ({
      feedUser,
      setFeedUser,
      feedClient,
      viewMode,
      setViewMode,
      userActivities,
      setUserActivities,
      addActivity,
      getActivities,
    }),
    [feedUser, feedClient, viewMode, userActivities, addActivity, getActivities]
  )

  return (
    <FeedContext.Provider value={contextValue}>{children}</FeedContext.Provider>
  )
}
