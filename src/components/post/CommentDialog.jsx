import styled from 'styled-components'

import PostActorName from './PostActorName'
import PostForm from './PostForm'
import Modal from '../modal/Modal'
import UserImage from '../profile/UserImage'
import { formatStringWithLink } from '../../utils/string'

const Container = styled.div`
  .modal-block {
    padding: 15px;
    width: 600px;
    height: max-content;
  }
`

const BlockContent = styled.div`
  .post {
    margin-top: 30px;
    display: flex;
    position: relative;

    &::after {
      content: '';
      background-color: #444;
      width: 2px;
      height: calc(100% - 35px);
      position: absolute;
      left: 20px;
      z-index: 0;
      top: 45px;
    }

    .img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 15px;
      border-radius: 50%;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .details {
      .actor-name {
        font-size: 15px;
        &--name {
          color: white;
          font-weight: bold;
        }

        &--id {
          color: #888;
        }
      }

      .post-text {
        color: white;
        margin-top: 3px;
        font-size: 14px;
      }

      .replying-info {
        color: #555;
        display: flex;
        margin-top: 20px;
        font-size: 14px;

        &--actor {
          margin-left: 5px;
          color: var(--theme-color);
        }
      }
    }
  }

  .comment {
    display: flex;
    margin-top: 20px;

    .img {
      width: 35px;
      height: 35px;
      margin-left: 3px;
      border-radius: 50%;
      margin-right: 15px;
      border-radius: 50%;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .comment-form {
      flex: 1;
      height: 120px;
    }
  }
`

export default function CommentDialog({
  activity,
  onPostComment,
  onClickOutside,
}) {
  const {
    object: { data: post },
  } = activity

  const postActor = activity.actor

  const onSubmit = async (text) => {
    await onPostComment(text)

    onClickOutside()
  }

  return (
    <Container>
      <Modal onClickOutside={onClickOutside} className="modal-block">
        <BlockContent>
          <div className="post">
            <div className="img">
              <UserImage
                src={postActor.data?.image}
                alt={postActor.data.name}
                userId={postActor.id}
              />
            </div>
            <div className="details">
              <PostActorName
                time={activity.time}
                name={postActor.data.name}
                id={postActor.data.id}
              />
              <p
                className="post-text"
                dangerouslySetInnerHTML={{
                  __html: formatStringWithLink(
                    post.text,
                    'post__text--link',
                    true
                  ).replace(/\n/g, '<br/>'),
                }}
              />
              <div className="replying-info">
                Replying to{' '}
                <span className="replying-info--actor">@{postActor.id}</span>
              </div>
            </div>
          </div>
          <div className="comment">
            <PostForm
              className="comment-form"
              submitText="Reply"
              placeholder="Post your reply"
              onSubmit={onSubmit}
              shouldFocus={true}
            />
          </div>
        </BlockContent>
      </Modal>
    </Container>
  )
}
