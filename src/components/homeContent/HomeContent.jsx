import React from 'react'
import styled from 'styled-components'
import { Feed, useStreamContext } from 'react-activity-feed'
import CreatePostTop from './CreatePostTop'
import MainHeader from '../header/MainHeader'
import Timeline from './Timeline'
import LoadingIndicator from '../loading/LoadingIndicator'
import { FeedProvider } from '../../contexts/feed/FeedContext'
import HeaderView from '../header/HeaderView'

const Container = styled.div`
  .header {
    position: sticky;
    top: 0;
    z-index: 1;
  }

  .create-post-top {
    border-bottom: 1px solid #333;
  }

  .new-posts-info {
    border-bottom: 1px solid #333;
    padding: 20px;
    text-align: center;
    color: var(--theme-color);
    display: block;
    width: 100%;
    font-size: 16px;

    &:hover {
      background: #111;
    }
  }
`

const HomeContent = () => {
  const { client } = useStreamContext()
  const user = client.currentUser.data

  if (!user)
    return (
      <Container>
        <LoadingIndicator />
      </Container>
    )

  return (
    <Container>
      <div className="header">
        <MainHeader />
        <FeedProvider>
          <HeaderView />
        </FeedProvider>
      </div>
      <Feed feedGroup="user">
        <div className="create-post-top">
          <CreatePostTop />
        </div>
        <Timeline />
      </Feed>
    </Container>
  )
}

export default HomeContent
