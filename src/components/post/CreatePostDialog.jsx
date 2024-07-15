import { StatusUpdateForm } from 'react-activity-feed'
import styled from 'styled-components'

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

  const onSuccess = async (activity) => {
    console.log('Post submitted successfully', activity)
    onClickOutside()
  }

  return (
    <Container>
      <Modal onClickOutside={onClickOutside} className="modal-block">
        <StatusUpdateForm
          feedGroup="user"
          activityVerb="post"
          onSuccess={onSuccess}
          doRequest={createPost}
        />
      </Modal>
    </Container>
  )
}
