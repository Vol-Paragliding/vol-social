import { useContext } from 'react'
import { FlatFeed } from 'react-activity-feed'

import PostBlock from '../post/PostBlock'
import { ProfileContext } from './ProfileContent'

export default function MyPosts() {
  const { user } = useContext(ProfileContext)

  return (
    <div>
      <FlatFeed Activity={PostBlock} userId={user.id} feedGroup="user" notify />
    </div>
  )
}
