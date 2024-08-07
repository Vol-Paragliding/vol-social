// import classNames from 'classnames'
import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { useFeed } from '../../contexts/feed/useFeed'
// import Emoji from '../Icons/Emoji'
// import Gif from '../Icons/Gif'
// import Image from '../Icons/Image'
// import Location from '../Icons/Location'
// import ProgressRing from '../Icons/ProgressRing'
import UserImage from '../profile/UserImage'

const Container = styled.div`
  width: 100%;

  .reply-to {
    font-size: 14px;
    color: #888;
    display: flex;
    margin-left: 55px;
    margin-bottom: 10px;

    &--name {
      margin-left: 4px;
      color: var(--theme-color);
    }
  }
`

const Form = styled.form`
  width: 100%;
  display: flex;
  align-items: ${({ inline }) => (inline ? 'center' : 'initial')};

  .user {
    min-width: 40px;
    max-width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 15px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .input-section {
    width: 100%;
    display: flex;
    flex: 1;
    flex-direction: ${({ inline }) => (inline ? 'row' : 'column')};
    align-items: ${({ inline }) => (inline ? 'center' : 'initial')};
    height: ${({ inline, minHeight }) => (inline ? '40px' : minHeight)};

    textarea {
      padding-top: 10px;
      background: none;
      border: none;
      padding-bottom: 0;
      font-size: 18px;
      width: 100%;
      flex: 1;
      resize: none;
      outline: none;
      color: white;
    }

    .actions {
      margin-top: ${({ inline }) => (inline ? '0' : 'auto')};
      display: flex;
      height: 50px;
      align-items: center;

      button {
        &:disabled {
          opacity: 0.5;
        }
      }

      .right {
        margin-left: auto;
        display: flex;
        align-items: center;
      }

      .post-length {
        position: relative;

        svg {
          position: relative;
          top: 2px;
        }

        &__text {
          position: absolute;
          color: #888;
          font-size: 14px;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          margin: auto;
          height: max-content;
          width: max-content;

          &.red {
            color: red;
          }
        }
      }

      .divider {
        height: 30px;
        width: 2px;
        border: none;
        background-color: #444;
        margin: 0 18px;
      }

      .submit-btn {
        background-color: var(--theme-color);
        padding: 10px 20px;
        color: black;
        border-radius: 30px;
        margin-left: auto;
        font-weight: bold;
        font-size: 16px;

        &:disabled {
          opacity: 0.6;
        }
      }
    }
  }
`

const actions = [
  // {
  //   id: 'image',
  //   Icon: Image,
  //   alt: 'Image',
  // },
  // {
  //   id: 'gif',
  //   Icon: Gif,
  //   alt: 'GIF',
  // },
  // {
  //   id: 'poll',
  //   Icon: Poll,
  //   alt: 'Poll',
  // },
  // {
  //   id: 'emoji',
  //   Icon: Emoji,
  //   alt: 'Emoji',
  // },
  // {
  //   id: 'location',
  //   Icon: Location,
  //   alt: 'Location',
  // },
]

export default function PostForm({
  submitText = 'Post',
  onSubmit,
  className,
  placeholder,
  collapsedOnMount = false,
  minHeight = 120,
  shouldFocus = false,
  replyingTo = null,
}) {
  const inputRef = useRef(null)

  const { feedUser } = useFeed()

  const [expanded, setExpanded] = useState(!collapsedOnMount)
  const [text, setText] = useState('')

  useEffect(() => {
    if (shouldFocus && inputRef.current) inputRef.current.focus()
  }, [])

  const MAX_CHARS = 280

  const percentage =
    text.length >= MAX_CHARS ? 100 : (text.length / MAX_CHARS) * 100

  const submit = async (e) => {
    e.preventDefault()

    if (exceededMax)
      return alert('Post cannot exceed ' + MAX_CHARS + ' characters')

    await onSubmit(text.trim())

    setText('')
  }

  const onClick = () => {
    setExpanded(true)
  }

  const isInputEmpty = !Boolean(text)

  const charsLeft = MAX_CHARS - text.length
  const maxAlmostReached = charsLeft <= 20
  const exceededMax = charsLeft < 0

  const isReplying = Boolean(replyingTo)

  return (
    <Container>
      {isReplying && expanded && (
        <span className="reply-to">
          Replying to <span className="reply-to--name">@{replyingTo}</span>
        </span>
      )}
      <Form
        minHeight={minHeight + 'px'}
        inline={!expanded}
        className={className}
        onSubmit={submit}
      >
        <div className="user">
          <UserImage
            src={feedUser?.data?.profile?.image}
            alt={feedUser?.data.name}
            username={feedUser?.data.username}
          />
        </div>
        <div className="input-section">
          <textarea
            ref={inputRef}
            onChange={(e) => setText(e.target.value)}
            placeholder={placeholder}
            value={text}
            onClick={onClick}
          />
          <div className="actions">
            {expanded &&
              actions.map((action) => {
                return (
                  <button
                    type="button"
                    disabled={action.id === 'location' && 'disabled'}
                    key={action.id}
                  >
                    <action.Icon size={19} color="var(--theme-color)" />
                  </button>
                )
              })}
            <div className="right">
              {/* {!isInputEmpty && (
                <div className="post-length">
                  <ProgressRing
                    stroke={2.2}
                    color={
                      exceededMax
                        ? 'red'
                        : maxAlmostReached
                        ? '#ffd400'
                        : 'var(--theme-color)'
                    }
                    radius={maxAlmostReached ? 19 : 14}
                    progress={percentage}
                  />
                  {maxAlmostReached && (
                    <span
                      className={classNames(
                        'post-length__text',
                        exceededMax && 'red'
                      )}
                    >
                      {charsLeft}
                    </span>
                  )}
                </div>
              )} */}
              {!isInputEmpty && <hr className="divider" />}
              <button
                type="submit"
                className="submit-btn"
                disabled={isInputEmpty}
              >
                {submitText}
              </button>
            </div>
          </div>
        </div>
      </Form>
    </Container>
  )
}
