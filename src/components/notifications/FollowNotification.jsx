import { Link } from 'react-router-dom'
import styled from 'styled-components'

import UserImage from '../profile/UserImage'
import User from '../Icons/User'

const Block = styled.div`
  padding: 15px;
  border-bottom: 1px solid #333;
  display: flex;

  a {
    color: white;
  }

  .right {
    margin-left: 20px;
    flex: 1;
  }

  .actors__images {
    display: flex;

    &__image {
      width: 35px;
      height: 35px;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 10px;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }

  .actors__text {
    margin-top: 10px;
    color: white;
    font-size: 15px;

    span {
      display: inline-block;
    }

    .actors__name {
      font-weight: bold;

      &:hover {
        text-decoration: underline;
      }
    }
  }
`

export default function FollowNotification({ followActivities }) {
  const firstActivity = followActivities[0]
  const otherCount = followActivities.length - 1

  const getOtherFollowersText = (count) => {
    if (count > 0) {
      return (
        <span>
          and {count} other{count > 1 ? 's' : ' pilot'}
        </span>
      )
    }
    return null
  }

  return (
    <Block>
      <User color="#1c9bef" size={25} />
      <div className="right">
        <div className="actors__images">
          {followActivities.map((follow) => (
            <Link
              to={`/${follow.actor.data.username}`}
              className="actors__images__image"
              key={follow.id}
            >
              <UserImage
                src={follow.actor.data.profile?.image}
                alt={follow.actor.data.name}
                username={follow.actor.data.username}
              />
            </Link>
          ))}
        </div>
        <p className="actors__text">
          <Link
            className="actors__name"
            to={`/${firstActivity.actor.data.username}`}
          >
            {firstActivity.actor.data.name}
          </Link>{' '}
          {getOtherFollowersText(otherCount)} followed you
        </p>
      </div>
    </Block>
  )
}
