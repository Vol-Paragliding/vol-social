import classNames from 'classnames'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useStreamContext } from 'react-activity-feed'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import FollowBtn from '../follow/FollowBtn'
import Search from '../Icons/Search'
import LoadingIndicator from '../loading/LoadingIndicator'
import UserImage from '../profile/UserImage'
import { useChat } from '../../contexts/chat/useChat'

const Container = styled.div`
  padding: 0 15px 15px;

  .search-container {
    z-index: 1;
    position: sticky;
    background-color: black;
    width: var(--right);
    padding-right: 30px;
    top: 0;
    padding-top: 15px;
    padding-bottom: 10px;

    .search-form {
      width: 100%;
      position: relative;

      .search-icon {
        position: absolute;
        top: 0;
        bottom: 0;
        margin: auto 0;
        left: 15px;
        width: 18px;
        height: 18px;
      }

      input {
        width: 100%;
        background: none;
        border: none;
        background-color: #222;
        font-size: 15px;
        padding: 15px 50px;
        border-radius: 30px;
        color: white;

        &:focus {
          outline: 2px solid var(--theme-color);
          background-color: black;
        }
      }

      .delete-btn {
        &.hide {
          display: none;
        }

        position: absolute;
        right: 15px;
        top: 50%;
        transform: translateY(-50%);
        background-color: var(--theme-color);
        color: black;
        border-radius: 50%;
        height: 25px;
        width: 25px;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        line-height: 1;
        padding: 0;
      }
    }
  }

  .trends,
  .follows {
    background-color: #222;
    border-radius: 20px;
    padding: 15px;

    h2 {
      font-size: 20px;
      color: white;
    }
  }

  .follows {
    margin-top: 20px;
    &-list {
      margin-top: 30px;
    }

    .user {
      margin-bottom: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      &__details {
        display: flex;
        text-decoration: none;
      }

      &__img {
        min-width: 40px;
        max-width: 40px;
        height: 40px;
        overflow: hidden;
        border-radius: 50%;
        margin-right: 10px;

        img {
          width: 100%;
          height: 100%;
        }
      }

      &__name {
        font-weight: bold;
        font-size: 16px;
        color: white;
      }

      &__id {
        color: #aaa;
        font-size: 14px;
        margin-top: 2px;
      }
    }

    .show-more-text {
      font-size: 14px;
      color: var(--theme-color);
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
  }
`

export default function RightSide() {
  const [searchText, setSearchText] = useState('')
  const [debouncedTerm, setDebouncedTerm] = useState('')
  const [users, setUsers] = useState([])
  const [, setOffset] = useState(0)
  const [renderLoadMore, setRenderLoadMore] = useState(true)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)
  const { client } = useStreamContext()
  const { chatClient } = useChat()
  const timerIDRef = useRef(null)

  const USERS_PER_PAGE = 10

  const queryUsers = useCallback(
    async (filter, sort, options) => {
      if (!chatClient) return null

      try {
        const response = await chatClient.queryUsers(filter, sort, options)
        return response
      } catch (error) {
        console.error('Error fetching users:', error)
        setError('Error fetching users')
        return null
      }
    },
    [chatClient]
  )

  const fetchUsers = useCallback(
    async (newOffset = 0, isLoadingMore = false) => {
      if (!chatClient || !chatClient.userID) {
        return
      }

      const filter = debouncedTerm
        ? {
            $or: [
              { name: { $autocomplete: debouncedTerm } },
              { id: { $autocomplete: debouncedTerm } },
            ],
            id: { $ne: 'zacheryconverse' },
          }
        : { id: { $nin: [chatClient.userID, 'zacheryconverse'] } }
      const sort = { last_active: -1 }
      const options = { limit: USERS_PER_PAGE, offset: newOffset }

      if (!isLoadingMore) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }
      try {
        const response = await queryUsers(filter, sort, options)
        if (!isLoadingMore) {
          setLoading(false)
        } else {
          setLoadingMore(false)
        }

        if (response) {
          setUsers((prevUsers) =>
            newOffset === 0 ? response.users : [...prevUsers, ...response.users]
          )
          setRenderLoadMore(response.users.length === USERS_PER_PAGE)
        }
      } catch (error) {
        console.error('Error fetching users:', error)
        setLoading(false)
        setLoadingMore(false)
      }
    },
    [debouncedTerm, queryUsers, chatClient]
  )

  useEffect(() => {
    fetchUsers(0)
  }, [fetchUsers])

  useEffect(() => {
    if (timerIDRef.current) {
      clearTimeout(timerIDRef.current)
    }

    timerIDRef.current = setTimeout(() => {
      setDebouncedTerm(searchText)
      if (searchText === '') {
        setOffset(0)
        setRenderLoadMore(true)
      }
    }, 500)

    return () => {
      clearTimeout(timerIDRef.current)
    }
  }, [searchText])

  const handleShowMore = () => {
    // Update the offset state before fetching more users
    setOffset((prevOffset) => {
      const newOffset = prevOffset + USERS_PER_PAGE
      fetchUsers(newOffset, true)
      return newOffset
    })
  }

  const whoToFollow = users.filter((u) => u.id !== client.userId)

  return (
    <Container>
      <div className="search-container">
        <form className="search-form">
          <div className="search-icon">
            <Search color="rgba(85,85,85,1)" />
          </div>
          <input
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
            placeholder="Search for pilots"
          />
          <button
            className={classNames(!Boolean(searchText) && 'hide', 'delete-btn')}
            type="button"
            onClick={() => setSearchText('')}
          >
            X
          </button>
        </form>
      </div>

      {loading ? (
        <LoadingIndicator />
      ) : (
        <div className="follows">
          <h2>Pilots</h2>
          <div className="follows-list">
            {whoToFollow.length ? (
              whoToFollow.map((user) => {
                return (
                  <div className="user" key={user.id}>
                    <Link to={`/${user.id}`} className="user__details">
                      <div className="user__img">
                        <UserImage
                          src={user.image}
                          alt={user.name}
                          userId={user.id}
                        />
                      </div>
                      <div className="user__info">
                        <span className="user__name">{user.name}</span>
                        <span className="user__id">@{user.id}</span>
                      </div>
                    </Link>
                    <FollowBtn userId={user.id} />
                  </div>
                )
              })
            ) : (
              <div>No pilots found</div>
            )}
          </div>
          {renderLoadMore && (
            <button className="show-more-text" onClick={handleShowMore}>
              {loadingMore ? 'Loading...' : 'Show more'}
            </button>
          )}
        </div>
      )}
      {error && <div className="error">{error}</div>}
    </Container>
  )
}
