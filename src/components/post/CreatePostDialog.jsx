import styled from 'styled-components'

import PostForm from './PostForm'
import Modal from '../modal/Modal'
import usePost from '../../hooks/usePost'

const Container = styled.div`
  .modal-block {
    margin-top: 20px;
    padding: 15px;
    width: 600px;
    height: max-content;
    z-index: 10;
  }

  .post-form {
    margin-top: 20px;
  }
`

export default function CreatePostDialog({ onClickOutside }) {
  const { createPost } = usePost()

  const onSubmit = async (text) => {
    createPost(text)

    onClickOutside()
  }

  return (
    <Container>
      <Modal onClickOutside={onClickOutside} className="modal-block">
        <PostForm
          onSubmit={onSubmit}
          shouldFocus={true}
          minHeight={240}
          className="post-form"
          placeholder="What's happening"
        />
      </Modal>
    </Container>
  )
}
