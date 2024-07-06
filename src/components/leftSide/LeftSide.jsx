import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { useStreamContext } from 'react-activity-feed'
import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'

import appIcon from '../../assets/appIcon.png'
import { useAuth } from '../../contexts/auth/useAuth'
import { useFeed } from '../../contexts/feed/useFeed'
import { logout } from '../../contexts/auth/AuthSlice'
import LoadingIndicator from '../loading/LoadingIndicator'
import UserImage from '../profile/UserImage'
import Bell from '../Icons/Bell'
import Group from '../Icons/Group'
import Home from '../Icons/Home'
import Mail from '../Icons/Mail'
import User from '../Icons/User'
import More from '../Icons/More'
import Search from '../Icons/Search'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 30px;
  height: 100%;

  .header {
    padding: 15px;
  }

  .logo {
    height: 46px;
  }

  .buttons {
    margin-top: 5px;
    max-width: 200px;

    a,
    button {
      display: block;
      margin-bottom: 12px;
      color: white;
      padding: 10px 15px;
      display: flex;
      align-items: center;
      border-radius: 30px;
      font-size: 18px;
      padding-right: 25px;
      text-decoration: none;
      --icon-size: 25px;

      .btn--icon {
        margin-right: 15px;
        height: var(--icon-size);
        width: var(--icon-size);

        position: relative;
        .notifications-count {
          position: absolute;
          font-size: 11px;
          background-color: var(--theme-color);
          top: -5px;
          padding: 1px 5px;
          border-radius: 10px;
          left: 0;
          right: 0;
          margin: 0 auto;
          width: max-content;
          color: black;
        }
      }

      &.active {
        font-weight: bold;

        img {
          --size: 27px;
        }
      }

      &:hover {
        background-color: #333;
      }

      &.btn--home {
        position: relative;
        &.new-posts::after {
          content: '';
          position: absolute;
          width: 5px;
          height: 5px;
          left: 35px;
          top: 7px;
          border-radius: 50%;
          background-color: var(--theme-color);
        }
      }

      &.btn--more {
        svg {
          border: 1px solid #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }

  .post-btn {
    background-color: var(--theme-color);
    margin-top: 10px;
    border-radius: 30px;
    color: black;
    font-weight: bold;
    text-align: center;
    padding: 15px 0;
    font-size: 16px;
  }

  .profile-section {
    margin-top: auto;
    margin-bottom: 20px;
    padding: 10px;
    display: flex;
    text-align: left;
    align-items: center;
    justify-content: space-between;
    border-radius: 30px;
    position: relative;
    cursor: pointer;

    &:hover {
      background-color: #333;
    }

    .details {
      display: flex;
      align-items: center;

      &__img {
        margin-right: 10px;
        width: 40px;
        border-radius: 50%;
        height: 40px;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      &__text {
        span {
          display: block;
        }

        &__name {
          color: white;
          font-size: 16px;
          font-weight: bold;
        }

        &__id {
          font-size: 14px;
          margin-top: 2px;
          color: #aaa;
        }
      }
    }
  }
`

const Menu = styled.div`
  position: absolute;
  bottom: calc(100% + 10px);
  right: 0;
  background: black;
  border: 1px solid #555;
  border-radius: 30px;
  overflow: hidden;
  width: 240px;
  padding: 10px;
  z-index: 2;
  box-shadow: 0 0 10px rgba(0, 0, 0, 1.5);
  cursor: pointer;

  &:hover {
    background: #333;
  }

  button {
    width: 100%;
    padding: 10px;
    color: white;
    background: none;
    border: none;
    text-align: left;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
  }
`

export default function LeftSide({ onClickPost }) {
  const location = useLocation()
  const { client, userData } = useStreamContext()
  const { feedUser } = useFeed()
  const { dispatch } = useAuth()
  const [newNotifications, setNewNotifications] = useState(0)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  useEffect(() => {
    if (!userData || location.pathname === `/notifications`) return

    let notifFeed

    async function init() {
      notifFeed = client.feed('notification', userData.id)
      const notifications = await notifFeed.get()

      const unread = notifications.results.filter(
        (notification) => !notification.is_seen
      )

      setNewNotifications(unread.length)

      notifFeed.subscribe((data) => {
        setNewNotifications((prev) => prev + data.new.length)
      })
    }

    init()

    return () => notifFeed?.unsubscribe()
  }, [userData, location.pathname])

  if (!userData)
    return (
      <Container>
        <LoadingIndicator />
      </Container>
    )

  const menus = [
    {
      id: 'home',
      label: 'Home',
      Icon: Home,
      link: '/home',
    },
    {
      id: 'explore',
      label: 'Explore',
      Icon: Search,
    },
    {
      id: 'communities',
      label: 'Communities',
      Icon: Group,
    },
    {
      id: 'notifications',
      label: 'Notifications',
      Icon: Bell,
      link: '/notifications',
      value: newNotifications,
      onClick: () => setNewNotifications(0),
    },
    {
      id: 'messages',
      label: 'Messages',
      Icon: Mail,
    },
    {
      id: 'profile',
      label: 'Profile',
      Icon: User,
      link: `/${userData.id}`,
    },
  ]

  const handleLogout = () => {
    logout(dispatch)
  }

  return (
    <Container>
      <Link to="/home" className="header">
        <img className={'logo'} src={appIcon} alt="Vol Company logo" />
      </Link>
      <div className="buttons">
        {menus.map((m) => {
          const isActiveLink =
            location.pathname === `/${m.id}` ||
            (m.id === 'profile' && location.pathname === `/${userData.id}`)

          return (
            <Link
              to={m.link ?? '#'}
              className={classNames(
                `btn--${m.id} new-posts`,
                isActiveLink && 'active'
              )}
              key={m.id}
              onClick={m.onClick}
            >
              <div className="btn--icon">
                {newNotifications && m.id === 'notifications' ? (
                  <span className="notifications-count">
                    {newNotifications}
                  </span>
                ) : null}
                <m.Icon fill={isActiveLink} color="white" size={25} />
              </div>
              <span>{m.label}</span>
            </Link>
          )
        })}
        <button className="btn--more">
          <div className="btn--icon">
            <More color="white" size={20} />
          </div>
          <span>More</span>
        </button>
      </div>
      <button onClick={onClickPost} className="post-btn">
        Post
      </button>
      <div
        className="profile-section"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <div className="details">
          <div className="details__img">
            <UserImage src={feedUser?.data?.image} alt={feedUser?.data?.name} />
          </div>
          <div className="details__text">
            <span className="details__text__name">{feedUser?.data.name}</span>
            <span className="details__text__id">@{userData.id}</span>
          </div>
        </div>
        <div>
          <More color="white" />
        </div>
        {isDropdownOpen && (
          <Menu>
            <button onClick={handleLogout}>Logout @{feedUser.id}</button>
          </Menu>
        )}
      </div>
    </Container>
  )
}
