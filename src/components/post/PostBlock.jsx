import classNames from 'classnames'
import { useState } from 'react'
import { useStreamContext } from 'react-activity-feed'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import useComment from '../../hooks/useComment'
import useLike from '../../hooks/useLike'
import { generatePostLink } from '../../utils/links'
import { formatStringWithLink } from '../../utils/string'
import Comment from '../Icons/Comment'
import Heart from '../Icons/Heart'
import More from '../Icons/More'
import Expand from '../Icons/Expand'
import Collapse from '../Icons/Collapse'
import UserImage from '../profile/UserImage'
import CommentDialog from './CommentDialog'
import { Gallery } from './Gallery'
import PostActorName from './PostActorName'
import LeafletMap from './LeafletMap'

const Block = styled.div`
  display: flex;
  border-bottom: 1px solid #333;
  padding: 15px;
  cursor: pointer;

  &:hover {
    background-color: rgb(17, 17, 17);
  }

  .user-image {
    min-width: 40px;
    max-width: 40px;
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
    cursor: pointer;
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
      margin-bottom: 10px;
      width: 100%;
      word-break: break-word;
      position: relative;

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
      overflow: hidden;
      width: calc(100% + 30px);
    }

    &__igc {
      width: calc(100% + 30px);
    }
  }

  .expand-text {
    color: var(--theme-color);
    cursor: pointer;
    font-size: 18px;
    font-weight: bold;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    position: absolute;
    right: -30px;
    bottom: 0;

    &:hover {
      background-color: #333;
    }
  }

  .more {
    width: 40px;
    height: 40px;
    display: flex;
    border-radius: 50%;
    justify-content: center;
    align-items: center;
    margin-top: -14px;

    &:hover {
      background-color: rgb(51, 51, 51);
    }
  }
`

export default function PostBlock({ activity }) {
  const { user } = useStreamContext()
  const navigate = useNavigate()
  const [commentDialogOpened, setCommentDialogOpened] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const { createComment } = useComment()
  const { toggleLike } = useLike()

  if (activity.verb === 'signup') {
    return null
  }

  const actor = activity.actor
  let hasLikedPost = false

  const post = activity.object.data

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
      onClick: () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        })
        setCommentDialogOpened(true)
      },
    },
  ]

  const postLink = activity.id ? generatePostLink(actor.id, activity.id) : '#'

  const onPostComment = async (text) => {
    await createComment(text, activity)
  }

  const images = activity.attachments?.images || []
  const igc = activity.attachments?.igc || null
  const wholeSite = igc && igc[0]?.data?.site
  const site = wholeSite ? wholeSite.split('-')[0] : null

  const handleMouseDown = (e) => {
    setIsDragging(false)
  }

  const handleMouseMove = (e) => {
    setIsDragging(true)
  }

  const handleMouseUp = (e) => {
    if (!isDragging && !e.defaultPrevented && !isNonNavigableClick(e.target)) {
      navigate(postLink)
    }
  }

  const isNonNavigableClick = (target) => {
    const nonNavigableClasses = [
      'expand-stats',
      'expand-text',
      'comment-icon',
      'heart-icon',
      'more-icon',
      'user-image',
      'post__igc',
      'post__image',
    ]

    const hasNonNavigableClass = (element) =>
      nonNavigableClasses.some((className) =>
        element.classList.contains(className)
      )

    let currentElement = target
    while (currentElement) {
      if (currentElement.classList && hasNonNavigableClass(currentElement)) {
        return true
      }
      currentElement = currentElement.parentElement
    }
    return false
  }

  const toggleTextExpansion = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsExpanded(!isExpanded)
  }

  const renderText = () => {
    const text = post?.text || ''
    if (text.length > 350) {
      return (
        <>
          <p className="post__text">
            {formatStringWithLink(
              isExpanded ? text : text.slice(0, 350),
              'post__text--link'
            )}{' '}
            {!isExpanded && '...'}
            <span onClick={toggleTextExpansion} className="expand-text">
              {!isExpanded ? <Expand /> : <Collapse />}
            </span>
          </p>
        </>
      )
    } else {
      return (
        <p className="post__text">
          {formatStringWithLink(text, 'post__text--link')}
        </p>
      )
    }
  }

  return (
    <>
      <Block
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        role="button"
      >
        <div className="user-image" onClick={(e) => e.stopPropagation()}>
          <UserImage
            src={actor.data?.image}
            alt={actor.data.name}
            userId={actor.id}
          />
        </div>
        <div className="post">
          <PostActorName
            name={actor.data.name}
            id={actor.id}
            time={activity.time}
            site={site}
          />
          <div className="post__details">
            {renderText()}
            {igc && igc.length > 0 && (
              <div className="post__igc" onClick={(e) => e.stopPropagation()}>
                <LeafletMap igc={igc[0]} />
              </div>
            )}
            {images.length > 0 && (
              <div className="post__image" onClick={(e) => e.stopPropagation()}>
                <Gallery images={images} />
              </div>
            )}
          </div>

          <div className="post__actions">
            {actions.map((action) => {
              return (
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    action.onClick?.()
                  }}
                  key={action.id}
                  type="button"
                  className={`${action.id}-icon`}
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
        <button
          className="more more-icon"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            console.log('More button clicked')
          }}
        >
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
