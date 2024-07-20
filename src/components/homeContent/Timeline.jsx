import React from 'react'
import {
  FlatFeed,
  useStreamContext,
  InfiniteScrollPaginator,
} from 'react-activity-feed'
import PostBlock from '../post/PostBlock'
import LoadingIndicator from '../loading/LoadingIndicator'

export default function Timeline() {
  const { user } = useStreamContext()

  // console.log('*********Timeline re-rendered with user*********:', user)

  return (
    <div>
      <FlatFeed
        Activity={PostBlock}
        userId={user.id}
        feedGroup="timeline"
        notify
        Paginator={(props) => (
          <InfiniteScrollPaginator
            threshold={10}
            loadingIndicator={<LoadingIndicator />}
            {...props}
          />
        )}
      />
    </div>
  )
}
