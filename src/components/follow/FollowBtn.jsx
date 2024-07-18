import classNames from 'classnames'
import styled from 'styled-components'
import { memo } from 'react'
import useFollow from '../../hooks/useFollow'

const Container = styled.div`
  button {
    text-align: center;
    padding: 0 15px;
    font-size: 13px;
    font-weight: bold;
    cursor: pointer;
    width: 100px;
    height: 30px;
    border-radius: 30px;

    &.following {
      color: white;
      background-color: transparent;
      border: 1px solid #666;
    }

    &.not-following {
      background-color: #ccc;
      width: 80px;
      color: black;
    }

    .follow-text {
      &__unfollow {
        display: none;
      }
      &__following {
        display: block;
      }
    }

    &:hover {
      &.following {
        color: red;
        border-color: red;

        .follow-text {
          &__unfollow {
            display: block;
          }
          &__following {
            display: none;
          }
        }
      }
    }
  }

  .loading {
    color: #666;
  }
`

const FollowBtn = memo(({ userId }) => {
  const { isFollowing, toggleFollow, loading } = useFollow({ userId })

  if (!userId) return null

  return (
    <Container>
      {loading ? (
        <button className="loading">Loading...</button>
      ) : (
        <button
          className={classNames(isFollowing ? 'following' : 'not-following')}
          onClick={toggleFollow}
        >
          {isFollowing ? (
            <div className="follow-text">
              <span className="follow-text__following">Following</span>
              <span className="follow-text__unfollow">Unfollow</span>
            </div>
          ) : (
            'Follow'
          )}
        </button>
      )}
    </Container>
  )
})

export default FollowBtn
