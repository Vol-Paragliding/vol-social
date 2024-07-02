import classNames from 'classnames'
import { useState } from 'react'
import { useStreamContext } from 'react-activity-feed'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { formatStringWithLink } from '../../utils/string'
import CommentDialog from './CommentDialog'
import Comment from '../Icons/Comment'
import Heart from '../Icons/Heart'
import Repost from '../Icons/Repost'
import Upload from '../Icons/Upload'
import More from '../Icons/More'
import PostActorName from './PostActorName'
import { generatePostLink } from '../../utils/links'
import useComment from '../../hooks/useComment'
import useLike from '../../hooks/useLike'
import UserImage from '../profile/UserImage'

const Block = styled.div`
  display: flex;
  border-bottom: 1px solid #333;
  padding: 15px;

  &:hover {
    background-color: rgb(17, 17, 17);
  }

  .user-image {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 10px;

    img,
    svg {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .post {
    flex: 1;
    .link {
      display: block;
      padding-bottom: 5px;
      text-decoration: none;
      width: 100%;
    }

    &__text {
      color: white;
      font-size: 15px;
      line-height: 20px;
      margin-top: 3px;
      width: 100%;

      &--link {
        color: var(--theme-color);
        text-decoration: none;
      }
    }

    &__actions {
      display: flex;
      justify-content: flex-start;
      margin-top: 5px;

      button {
        display: flex;
        align-items: center;
      }

      &__value {
        margin-left: 10px;
        color: #666;

        &.colored {
          color: var(--theme-color);
        }
      }
    }

    &__image {
      margin-top: 20px;
      border-radius: 20px;
      border: 1px solid #333;
      overflow: hidden;
      width: calc(100% + 20px);

      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
    }
  }

  .more {
    width: 40px;
    height: 40px;
    display: flex;
  }
`

export default function PostBlock({ activity }) {
  const { user } = useStreamContext()
  const navigate = useNavigate()
  const [commentDialogOpened, setCommentDialogOpened] = useState(false)

  const { createComment } = useComment()
  const { toggleLike } = useLike()
  if (activity.verb === 'signup') {
    return null
  }

  const actor = activity.actor

  let hasLikedPost = false

  const post = activity.object.data

  // check if current logged in user has liked post
  if (activity?.own_reactions?.like) {
    const myReaction = activity.own_reactions.like.find(
      (l) => l.user.id === user.id
    )
    hasLikedPost = Boolean(myReaction)
  }

  const onToggleLike = async () => {
    await toggleLike(activity, hasLikedPost)
  }

  const actions = [
    {
      id: 'heart',
      Icon: Heart,
      alt: 'Heart',
      value: activity?.reaction_counts?.like || 0,
      onClick: onToggleLike,
    },
    {
      id: 'comment',
      Icon: Comment,
      alt: 'Comment',
      value: activity?.reaction_counts?.comment || 0,
      onClick: () => setCommentDialogOpened(true),
    },
  ]

  const postLink = activity.id ? generatePostLink(actor.id, activity.id) : '#'

  const onPostComment = async (text) => {
    await createComment(text, activity)
  }

  return (
    <>
      <Block>
        <div className="user-image">
          <UserImage src={actor.data?.image} alt={actor.data.name} />
        </div>
        <div className="post">
          <button onClick={() => navigate(postLink)} className="link">
            <PostActorName
              name={actor.data.name}
              id={actor.id}
              time={activity.time}
            />
            <div className="post__details">
              <p
                className="post__text"
                dangerouslySetInnerHTML={{
                  __html: formatStringWithLink(
                    post?.text || '',
                    'post__text--link'
                  ).replace(/\n/g, '<br/>'),
                }}
              />
            </div>
          </button>

          <div className="post__actions">
            {actions.map((action) => {
              return (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    action.onClick?.()
                  }}
                  key={action.id}
                  type="button"
                >
                  <action.Icon
                    color={
                      action.id === 'heart' && hasLikedPost
                        ? 'var(--theme-color)'
                        : '#777'
                    }
                    size={17}
                    fill={action.id === 'heart' && hasLikedPost && true}
                  />
                  <span
                    className={classNames('post__actions__value', {
                      colored: action.id === 'heart' && hasLikedPost,
                    })}
                  >
                    {action.value}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
        <button className="more">
          <More color="#777" size={20} />
        </button>
      </Block>
      {activity.id && commentDialogOpened && (
        <CommentDialog
          onPostComment={onPostComment}
          shouldOpen={commentDialogOpened}
          onClickOutside={() => setCommentDialogOpened(false)}
          activity={activity}
        />
      )}
    </>
  )
}
