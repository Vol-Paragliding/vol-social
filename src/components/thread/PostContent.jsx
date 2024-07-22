import { format } from 'date-fns'
import { useFeedContext, useStreamContext } from 'react-activity-feed'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useState } from 'react'

import useComment from '../../hooks/useComment'
import useLike from '../../hooks/useLike'
import { formatStringWithLink } from '../../utils/string'
import UserImage from '../profile/UserImage'
import CommentDialog from '../post/CommentDialog'
import PostForm from '../post/PostForm'
import Comment from '../Icons/Comment'
import Heart from '../Icons/Heart'
import More from '../Icons/More'
import { Gallery } from '../post/Gallery'
import LeafletMap from '../post/LeafletMap'
import PostCommentBlock from './PostCommentBlock'

const Container = styled.div`
  padding: 10px 15px;

  .user {
    display: flex;
    text-decoration: none;

    &__image {
      min-width: 40px;
      max-width: 40px;
      height: 40px;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 15px;

      img {
        width: 100%;
        height: 100%;
      }
    }

    &__name {
      &--name {
        color: white;
        font-weight: bold;
      }
      &--id {
        color: #52575b;
        font-size: 14px;
      }
    }

    &__option {
      margin-left: auto;
      height: 40px;
      width: 40px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;

      &:hover {
        background-color: #333;
      }
    }
  }

  .post {
    margin-top: 20px;

    a {
      text-decoration: none;
      color: var(--theme-color);
    }

    &__text {
      color: white;
      font-size: 20px;
      margin-bottom: 10px;
      word-break: break-word;

      &--link {
        color: var(--theme-color);
        text-decoration: none;
      }
    }

    &__time,
    &__reactions,
    &__reactors {
      height: 50px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #555;
      font-size: 15px;
      color: #888;
    }

    &__time {
      &--date {
        margin-left: 12px;
        position: relative;

        &::after {
          position: absolute;
          content: '';
          width: 2px;
          height: 2px;
          background-color: #777;
          border-radius: 50%;
          top: 0;
          bottom: 0;
          left: -7px;
          margin: auto 0;
        }
      }
    }

    &__reactions {
      &__likes {
        display: flex;

        .reaction-count {
          color: white;
          font-weight: bold;
        }

        .reaction-label {
          margin-left: 4px;
        }
      }
    }

    &__reactors {
      justify-content: flex-start;
    }
  }

  .write-reply {
    align-items: center;
    padding: 15px 0;
    border-bottom: 1px solid #555;
  }
`

export default function PostContent({ activity }) {
  const feed = useFeedContext()
  const { client } = useStreamContext()

  const { createComment } = useComment()
  const { toggleLike } = useLike()

  const time = format(new Date(activity.time), 'p')
  const date = format(new Date(activity.time), 'PP')

  const post = activity.object.data
  const postActor = activity.actor.data

  const [commentDialogOpened, setCommentDialogOpened] = useState(false)

  let hasLikedPost = false

  if (activity?.own_reactions?.like) {
    const myReaction = activity.own_reactions.like.find(
      (l) => l.user.id === client.userId
    )
    hasLikedPost = Boolean(myReaction)
  }

  const onToggleLike = async () => {
    await toggleLike(activity, hasLikedPost)
    feed.refresh()
  }

  const reactors = [
    {
      id: 'heart',
      Icon: Heart,
      onClick: onToggleLike,
    },
    {
      id: 'comment',
      Icon: Comment,
      onClick: () => setCommentDialogOpened(true),
    },
  ]

  const onPostComment = async (text) => {
    await createComment(text, activity)

    feed.refresh()
  }

  const images = activity.attachments?.images || []
  const igc = activity.attachments?.igc || null

  return (
    <>
      {commentDialogOpened && (
        <CommentDialog
          activity={activity}
          onPostComment={onPostComment}
          onClickOutside={() => setCommentDialogOpened(false)}
        />
      )}
      <Container>
        <Link className="user">
          <div className="user__image">
            <UserImage
              src={postActor?.image}
              alt={postActor.name}
              username={postActor.username}
            />
          </div>
          <div className="user__name">
            <span className="user__name--name">{postActor.name}</span>
            <span className="user__name--id">@{postActor.username}</span>
          </div>
          <div className="user__option">
            <More color="#777" size={20} />
          </div>
        </Link>
        <div className="post">
          <p className="post__text">
            {formatStringWithLink(post.text, 'post__text--link')}
          </p>
          {igc && igc.length > 0 && (
            <div className="post__igc" onClick={(e) => e.stopPropagation()}>
              <LeafletMap igc={igc[0]} />
            </div>
          )}
          {images.length > 0 && (
            <div className="post__image">
              <Gallery images={images} />
            </div>
          )}
          <div className="post__time">
            <span className="post__time--time">{time}</span>
            <span className="post__time--date">{date}</span>
          </div>

          <div className="post__reactions">
            <div className="post__reactions__likes">
              <span className="reaction-count">
                {activity.reaction_counts.like || '0'}
              </span>
              <span className="reaction-label">Likes</span>
            </div>
          </div>

          <div className="post__reactors">
            {reactors.map((action, i) => (
              <button onClick={action.onClick} key={`reactor-${i}`}>
                <action.Icon
                  color={
                    action.id === 'heart' && hasLikedPost
                      ? 'var(--theme-color)'
                      : '#888'
                  }
                  fill={action.id === 'heart' && hasLikedPost && true}
                  size={20}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="write-reply">
          <PostForm
            onSubmit={onPostComment}
            submitText="Reply"
            collapsedOnMount={true}
            placeholder="Post your reply"
            replyingTo={postActor.username}
          />
        </div>
        {activity.latest_reactions?.comment?.map((comment) => (
          <PostCommentBlock key={comment.id} comment={comment} />
        ))}
      </Container>
    </>
  )
}
