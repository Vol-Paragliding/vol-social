import styled from 'styled-components'
import { StatusUpdateForm } from 'react-activity-feed'
import 'react-activity-feed/dist/index.css'

import usePost from '../../hooks/usePost'

const Container = styled.div`
  // padding: 15px;
`

export default function CreatePostTop() {
  const { createPost } = usePost()

  const onSuccess = async (activity) => {
    console.log('Post submitted successfully', activity)
  }

  return (
    <Container>
      <StatusUpdateForm
        feedGroup="user"
        activityVerb="post"
        onSuccess={onSuccess}
        doRequest={createPost}
      />
    </Container>
  )
}
