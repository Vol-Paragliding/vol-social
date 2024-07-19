import { useFeedContext } from 'react-activity-feed'

import CreatePostForm from '../post/CreatePostForm'
import usePost from '../../hooks/usePost'

export default function CreatePostTop() {
  const { refresh } = useFeedContext()
  const { createPost } = usePost()

  const onSuccess = async (activity) => {
    console.log('Post submitted successfully', activity)
    await refresh()
  }

  return (
    <CreatePostForm
      feedGroup="user"
      activityVerb="post"
      onSuccess={onSuccess}
      doRequest={createPost}
      Header={false}
    />
  )
}
