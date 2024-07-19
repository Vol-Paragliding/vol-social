import { FlatFeed, InfiniteScrollPaginator } from 'react-activity-feed'
import { useParamUser } from '../../contexts/paramUser/useParamUser'
import LoadingIndicator from '../loading/LoadingIndicator'
import PostBlock from '../post/PostBlock'

export default function MyPosts() {
  const { paramUser } = useParamUser()

  if (!paramUser) return <LoadingIndicator />

  return (
    <div>
      <FlatFeed
        Activity={PostBlock}
        userId={paramUser.id}
        feedGroup="user"
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
