import { useEffect, useState } from 'react'
import { useFeedContext, useStreamContext } from 'react-activity-feed'
import { useParams } from 'react-router-dom'

import LoadingIndicator from '../loading/LoadingIndicator'
import PostContent from './PostContent'
import ThreadHeader from './ThreadHeader'

const FEED_ENRICH_OPTIONS = {
  withRecentReactions: true,
  withOwnReactions: true,
  withReactionCounts: true,
  withOwnChildren: true,
}

export default function ThreadContent() {
  const { client } = useStreamContext()
  const { id } = useParams()
  const feed = useFeedContext()

  const [activity, setActivity] = useState(null)

  useEffect(() => {
    const fetchActivityById = async () => {
      try {
        const response = await client.getActivities({
          ids: [id],
          ...FEED_ENRICH_OPTIONS,
        })

        if (response.results.length > 0) {
          setActivity(response.results[0])
        } else {
          console.error('Activity not found')
        }
      } catch (error) {
        console.error('Error fetching activity by ID:', error)
      }
    }

    if (feed.refreshing || !feed.hasDoneRequest) return

    const activityPaths = feed.feedManager.getActivityPaths(id) || []

    if (activityPaths.length) {
      const targetActivity = feed.feedManager.state.activities
        .getIn([...activityPaths[0]])
        .toJS()

      setActivity(targetActivity)
    } else {
      fetchActivityById()
    }
  }, [feed.feedManager, feed.hasDoneRequest, feed.refreshing, id, client])

  if (!client || !activity) return <LoadingIndicator />

  return (
    <div>
      <ThreadHeader />
      <PostContent activity={activity} />
    </div>
  )
}
