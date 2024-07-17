import { useState } from 'react'
import { useStreamContext } from 'react-activity-feed'
import styled from 'styled-components'

import LeftSide from '../leftSide/LeftSide'
import RightSide from '../rightSide/RightSide'
import CreatePostDialog from '../post/CreatePostDialog'
import LoadingIndicator from '../loading/LoadingIndicator'

const Container = styled.div`
  min-height: 100vh;
  background: black;
  position: relative;

  .content {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .right-side-bar {
    display: none;
  }

  .main-content {
    width: 100%;
    min-height: 100vh;
    border-left: none;
    border-right: none;
  }

  @media (max-width: 868px) {
    .left-side-bar {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      display: flex;
      justify-content: space-around;
      backdrop-filter: blur(2px);
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 10;
    }

    .main-content {
      margin-top: 60px;
    }
  }

  @media (min-width: 868px) {
    .content {
      max-width: 1300px;
      margin: 0 auto;
      flex-direction: row;
      justify-content: center;
    }

    .left-side-bar {
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100vh;
      position: sticky;
      top: 0;
      transition: width 0.3s;
    }

    .main-content {
      flex: 1 1 600px;
      max-width: 600px;
      border-left: 1px solid #333;
      border-right: 1px solid #333;
      order: 1;
    }

    .right-side-bar {
      display: block;
      max-width: 400px;
      flex: 1 0 200px;
      order: 2;
    }
  }
`

export default function Layout({ children }) {
  const { user } = useStreamContext()
  const [createDialogOpened, setCreateDialogOpened] = useState(false)

  if (!user) return <LoadingIndicator />

  return (
    <>
      {createDialogOpened && (
        <CreatePostDialog onClickOutside={() => setCreateDialogOpened(false)} />
      )}
      <Container>
        <div className="content">
          <div className="left-side-bar">
            <LeftSide
              onClickPost={() => {
                window.scrollTo({
                  top: 0,
                  behavior: 'smooth',
                })
                setCreateDialogOpened(true)
              }}
            />
          </div>
          <main className="main-content">
            {!user ? <LoadingIndicator /> : children}
          </main>
          <div className="right-side-bar">
            <RightSide />
          </div>
        </div>
      </Container>
    </>
  )
}
