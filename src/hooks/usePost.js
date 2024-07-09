import { nanoid } from 'nanoid'
import { useStreamContext } from 'react-activity-feed'

export default function usePost() {
  const { client } = useStreamContext()

  const createPost = async (activity) => {
    const collection = await client.collections.add('post', nanoid(), {
      text: activity.text,
    })

    const enrichedActivity = {
      ...activity,
      object: `SO:post:${collection.id}`,
    }

    return client
      .feed(activity.feedGroup || 'user', client.userId)
      .addActivity(enrichedActivity)
  }

  // const user = client.feed('user', client.userId)

  // const createPost = async (text) => {
  //   const collection = await client.collections.add('post', nanoid(), { text })

  //   await user.addActivity({
  //     verb: 'post',
  //     object: `SO:post:${collection.id}`,
  //   })
  // }

  return {
    createPost,
  }
}
