import CreatePostForm from '../post/CreatePostForm'
import usePost from '../../hooks/usePost'

export default function CreatePostTop() {
  const { createPost } = usePost()

  const onSuccess = async (activity) => {
    console.log('Post submitted successfully', activity)
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
