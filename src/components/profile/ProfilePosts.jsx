import { useContext } from 'react'
import { FlatFeed, useStreamContext } from 'react-activity-feed'

import PostBlock from '../post/PostBlock'

export default function MyPosts() {
  const { user } = useStreamContext()

  return (
    <div>
      <FlatFeed Activity={PostBlock} userId={user.id} feedGroup="user" notify />
    </div>
  )
}
