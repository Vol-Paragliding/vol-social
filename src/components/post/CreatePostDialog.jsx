import styled from 'styled-components'

import Modal from '../modal/Modal'
import usePost from '../../hooks/usePost'
import CreatePostForm from './CreatePostForm'

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

  const onSuccess = async (activity) => {
    console.log('Post submitted successfully', activity)
    onClickOutside()
  }

  return (
    <Container>
      <Modal onClickOutside={onClickOutside} className="modal-block">
        <CreatePostForm
          feedGroup="user"
          activityVerb="post"
          onSuccess={onSuccess}
          doRequest={createPost}
          Header={false}
          autoFocus
        />
      </Modal>
    </Container>
  )
}
