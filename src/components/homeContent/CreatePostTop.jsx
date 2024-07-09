import styled from 'styled-components'
import { StatusUpdateForm } from 'react-activity-feed'
import 'react-activity-feed/dist/index.css'

import usePost from '../../hooks/usePost'
// import PostForm from '../post/PostForm'

const Container = styled.div`
  // padding: 15px;
`

export default function CreatePostTop() {
  const { createPost } = usePost()

  const onSuccess = async (activity) => {
    console.log('Post submitted successfully', activity)
  }

  // const onSubmit = async (text) => {
  //   createPost(text)
  // }

  return (
    <Container>
      {/* <PostForm placeholder="Share a flight" onSubmit={onSubmit} /> */}
      <StatusUpdateForm
        feedGroup="user"
        activityVerb="post"
        onSuccess={onSuccess}
        doRequest={createPost}
      />
    </Container>
  )
}
