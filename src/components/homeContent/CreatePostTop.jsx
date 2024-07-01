import styled from 'styled-components'

import usePost from '../../hooks/usePost'
import PostForm from '../post/PostForm'

const Container = styled.div`
  padding: 15px;
`

export default function CreatePostTop() {
  const { createPost } = usePost()

  const onSubmit = async (text) => {
    createPost(text)
  }

  return (
    <Container>
      <PostForm placeholder="Share a flight" onSubmit={onSubmit} />
    </Container>
  )
}
