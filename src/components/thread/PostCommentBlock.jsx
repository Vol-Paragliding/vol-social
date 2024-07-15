import styled from 'styled-components'

import { formatStringWithLink } from '../../utils/string'
import PostActorName from '../post/PostActorName'
import UserImage from '../profile/UserImage'
import More from '../Icons/More'
import { Gallery } from '../post/Gallery'

const Block = styled.div`
  display: flex;
  border-bottom: 1px solid #333;
  padding: 15px 0;

  .user-image {
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

  .comment-post {
    flex: 1;
    .link {
      display: block;
      padding-bottom: 5px;
      text-decoration: none;
    }

    &__text {
      color: white;
      font-size: 15px;
      line-height: 20px;
      margin-top: 3px;
      word-break: break-word;

      &--link {
        color: var(--theme-color);
        text-decoration: none;
      }
    }
  }

  .more {
    width: 40px;
    height: 40px;
    display: flex;
    opacity: 0.6;
    border-radius: 50%;
    justify-content: center;
    align-items: center;
    margin-top: -14px;

    &:hover {
      background-color: rgb(51, 51, 51);
    }
  }

  .comment-post__image {
    margin-top: 10px;
    overflow: hidden;
  }
`

export default function PostCommentBlock({ comment }) {
  const { user, data: postComment } = comment

  const images = comment.attachments?.images || []

  return (
    <Block to="/">
      <div className="user-image">
        <UserImage
          src={user.data?.image}
          alt={user.data.name}
          userId={user.id}
        />
      </div>
      <div className="comment-post">
        <div>
          <PostActorName
            name={user.data.name}
            id={user.id}
            time={comment.created_at}
          />
          <div className="post__details">
            <p className="comment-post__text">
              {formatStringWithLink( postComment.text, 'post__text--link' )}
            </p>
            {images.length > 0 && (
              <div className="comment-post__image">
                <Gallery images={images} />
              </div>
            )}
          </div>
        </div>
      </div>
      <button className="more">
        <More size={18} color="white" />
      </button>
    </Block>
  )
}
