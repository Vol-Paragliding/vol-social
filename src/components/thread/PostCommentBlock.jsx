import styled from 'styled-components'

import { formatStringWithLink } from '../../utils/string'
import PostActorName from '../post/PostActorName'
import UserImage from '../profile/UserImage'
import More from '../Icons/More'

const Block = styled.div`
  display: flex;
  border-bottom: 1px solid #333;
  padding: 15px 0;

  .user-image {
    width: 40px;
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

      &--link {
        color: var(--theme-color);
        text-decoration: none;
      }
    }
  }

  .more {
    width: 30px;
    height: 20px;
    display: flex;
    opacity: 0.6;
  }
`

export default function PostCommentBlock({ comment }) {
  const { user, data: postComment } = comment

  return (
    <Block to="/">
      <div className="user-image">
        <UserImage src={user.data?.image} alt={user.data.name} />
      </div>
      <div className="comment-post">
        <div>
          <PostActorName
            name={user.data.name}
            id={user.id}
            time={comment.created_at}
          />
          <div className="post__details">
            <p
              className="comment-post__text"
              dangerouslySetInnerHTML={{
                __html: formatStringWithLink(
                  postComment.text,
                  'post__text--link'
                ).replace(/\n/g, '<br/>'),
              }}
            />
          </div>
        </div>
      </div>
      <button className="more">
        <More size={18} color="white" />
      </button>
    </Block>
  )
}
