import { useEffect, useState } from 'react'
import { useStreamContext } from 'react-activity-feed'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { useFeed } from '../../contexts/feed/useFeed'
import ArrowLeft from '../Icons/ArrowLeft'

const Header = styled.header`
  .top {
    display: flex;
    align-items: center;
    padding: 15px;
    color: white;
    width: 100%;
    backdrop-filter: blur(2px);
    background-color: rgba(0, 0, 0, 0.5);

    .info {
      margin-left: 30px;

      h1 {
        font-size: 20px;
      }

      &__posts-count {
        font-size: 14px;
        margin-top: 2px;
        color: #888;
      }
    }
  }

  .cover {
    width: 100%;
    background-color: #555;
    height: 200px;
    overflow: hidden;

    img {
      width: 100%;
      object-fit: cover;
      object-position: center;
    }
  }
`

export default function ProfileHeader() {
  const navigate = useNavigate()
  const { client } = useStreamContext()
  const { feedUser } = useFeed()

  const [activitiesCount, setActivitiesCount] = useState(0)

  useEffect(() => {
    if (!client || !feedUser) return
    const feed = client.feed('user', feedUser.id)

    async function getActivitiesCount() {
      const activities = await feed.get()
      setActivitiesCount(activities.results.length-1)
    }

    getActivitiesCount()
  }, [client, feedUser?.id])

  const navigateBack = () => {
    navigate(-1)
  }

  return (
    <Header>
      <div className="top">
        <button onClick={navigateBack}>
          <ArrowLeft size={20} color="white" />
        </button>
        <div className="info">
          <h1>{feedUser?.data.name}</h1>
          <span className="info__posts-count">
            {activitiesCount} Post{activitiesCount > 1 && 's'}
          </span>
        </div>
      </div>
      <div className="cover">
        {feedUser?.data?.coverPhoto ? (
          <img src={feedUser.data.coverPhoto} alt="Cover" />
        ) : (
          <div style={{ backgroundColor: '#555', height: '200px' }} />
        )}
      </div>
    </Header>
  )
}
