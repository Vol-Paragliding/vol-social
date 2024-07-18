import styled from 'styled-components'
import { useStreamContext, useFeedContext } from 'react-activity-feed'
import FollowBtn from '../follow/FollowBtn'

const MenuContainer = styled.div`
  position: absolute;
  background-color: #222;
  border: 1px solid #333;
  border-radius: 5px;
  right: 10px;
  top: 40px;
  z-index: 10;
  width: 150px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);

  .menu-item {
    padding: 10px;
    cursor: pointer;
    color: white;
    text-align: center;
    border-bottom: 1px solid #333;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background-color: #444;
    }
  }
`

export default function MoreMenu({ activity, onClose }) {
  const { client, user } = useStreamContext()
  const { refresh } = useFeedContext()

  const handleDeletePost = async () => {
    try {
      const feed = client.feed('user', user.id)
      await feed.removeActivity(activity.id)

      refresh()
      onClose()
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }

  return (
    <MenuContainer>
      {user.id !== activity.actor.id && (
        <div className="menu-item" onClick={onClose}>
          <FollowBtn userId={activity.actor.id} />
        </div>
      )}
      {user.id === activity.actor.id && (
        <div className="menu-item" onClick={handleDeletePost}>
          Delete
        </div>
      )}
    </MenuContainer>
  )
}
