import { useFeedContext, useStreamContext } from 'react-activity-feed'

import useNotification from './useNotification'

export default function useLike() {
  const feed = useFeedContext()
  const { createNotification } = useNotification()
  const { user } = useStreamContext()

  const toggleLike = async (activity, hasLikedPost) => {
    const actor = activity.actor

    await feed.onToggleReaction('like', activity)

    if (!hasLikedPost && actor.id !== user.id) {
      // then it is not the logged in user liking their own post
      createNotification(actor.id, 'like', {}, `SO:post:${activity.object.id}`)
    }
  }

  return { toggleLike }
}
