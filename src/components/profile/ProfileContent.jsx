import styled from 'styled-components'
import { useStreamContext } from 'react-activity-feed'

import LoadingIndicator from '../loading/LoadingIndicator'
import ProfileBio from './ProfileBio'
import ProfileHeader from './ProfileHeader'
import ProfilePosts from './ProfilePosts'
import TabList from './TabList'

const Container = styled.div`
  --profile-image-size: 120px;

  .tab-list {
    margin-top: 30px;
  }
`

export default function ProfileContent() {
  const { client } = useStreamContext()

  if (!client) return <LoadingIndicator />

  return (
      <Container>
        <ProfileHeader />
        <main>
          <ProfileBio />
          <div className="tab-list">
            <TabList />
          </div>
          <ProfilePosts />
        </main>
      </Container>
  )
}
