import { nanoid } from 'nanoid'
import { useStreamContext } from 'react-activity-feed'

export default function usePost() {
  const { client } = useStreamContext()

  const user = client.feed('user', client.userId)

  const createPost = async (text) => {
    const collection = await client.collections.add('post', nanoid(), { text })

    await user.addActivity({
      verb: 'post',
      object: `SO:post:${collection.id}`,
    })
  }

  return {
    createPost,
  }
}
