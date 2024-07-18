import { useEffect, useState } from 'react'
import { useStreamContext } from 'react-activity-feed'
import useNotification from './useNotification'

export default function useFollow({ userId }) {
  const { client } = useStreamContext()
  const { createNotification } = useNotification()
  const [isFollowing, setIsFollowing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function init() {
      const response = await client
        .feed('timeline', client.userId)
        .following({ filter: [`user:${userId}`] })

      setIsFollowing(!!response.results.length)
      setLoading(false)
    }

    if (userId) {
      init()
    }
  }, [client, userId])

  const toggleFollow = async () => {
    setLoading(true)
    const action = isFollowing ? 'unfollow' : 'follow'

    if (action === 'follow') {
      await createNotification(userId, 'follow')
    }

    const timelineFeed = client.feed('timeline', client.userId)
    await timelineFeed[action]('user', userId)

    setIsFollowing((isFollowing) => !isFollowing)
    setLoading(false)
  }

  return { isFollowing, toggleFollow, loading }
}
