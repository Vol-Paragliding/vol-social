import { FlatFeed, useStreamContext } from 'react-activity-feed'

import PostBlock from '../post/PostBlock-old'

export default function Timeline() {
  const { user } = useStreamContext()

  return (
    <div>
      <FlatFeed Activity={PostBlock} userId={user.id} feedGroup="timeline" />
    </div>
  )
}
