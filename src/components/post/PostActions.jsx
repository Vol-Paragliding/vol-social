import React from 'react'
import classNames from 'classnames'
import styled from 'styled-components'

import Comment from '../Icons/Comment'
import Heart from '../Icons/Heart'
import useLike from '../../hooks/useLike'

const ActionsContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: 5px;

  button {
    display: flex;
    align-items: center;
    margin-right: 10px; /* Add some spacing between buttons if needed */
  }

  .post__actions__value {
    margin-left: 10px;
    color: #666;

    &.colored {
      color: var(--theme-color);
    }
  }
`

const PostActions = ({ activity, hasLikedPost, setCommentDialogOpened }) => {
  const { toggleLike } = useLike()

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

  return (
    <ActionsContainer className="post__actions">
      {actions.map((action) => (
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
      ))}
    </ActionsContainer>
  )
}

export default PostActions
