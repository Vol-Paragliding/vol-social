import { useState } from 'react'
import styled from 'styled-components'
import { format } from 'date-fns'
import { useStreamContext } from 'react-activity-feed'

import { useFeed } from '../../contexts/feed/useFeed'
import { useParamUser } from '../../contexts/paramUser/useParamUser'
import { formatStringWithLink } from '../../utils/string'
import FollowBtn from '../follow/FollowBtn'
import Calendar from '../Icons/Calendar'
import More from '../Icons/More'
import LoadingIndicator from '../loading/LoadingIndicator'
import Modal from '../modal/Modal'
import { EditProfileView } from './EditProfileView'
import ProfileMoreMenu from './ProfileMoreMenu'
import UserImage from './UserImage'

const Container = styled.div`
  padding: 20px;
  position: relative;
  border-bottom: 1px solid #555;

  .top {
    display: flex;
    justify-content: space-between;
    margin-top: calc(var(--profile-image-size) / -2);

    .image {
      width: var(--profile-image-size);
      height: var(--profile-image-size);
      border-radius: 50%;
      overflow: hidden;
      border: 4px solid black;
      background-color: #444;
      display: flex;
      align-items: center;
      justify-content: center;

      img,
      svg {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .actions {
      position: relative;
      top: 55px;
      display: flex;

      .action-btn {
        border: 1px solid #777;
        margin-right: 10px;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }

  .details {
    color: #888;
    margin-top: 20px;

    .user {
      &__name {
        color: white;
        font-weight: bold;
      }

      &__id {
        margin-top: 2px;
        font-size: 15px;
      }

      &__bio {
        color: white;
        margin-top: 10px;
        word-break: break-word;

        a {
          color: var(--theme-color);
          text-decoration: none;
        }
      }

      &__joined {
        display: flex;
        align-items: center;
        margin-top: 15px;
        font-size: 15px;

        &--text {
          margin-left: 5px;
        }
      }

      &__follows {
        font-size: 15px;
        display: flex;
        margin-top: 15px;

        b {
          color: white;
        }

        &__followers {
          margin-left: 20px;
        }
      }

      &__followed-by {
        font-size: 13px;
        margin-top: 15px;
      }
    }
  }
`

const ActionButton = styled.button`
  border: 1px solid #666;
  border-radius: 30px;
  height: 34px;
  color: white;
  font-size: 14px;
  padding: 0 20px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #333;
  }
`

export default function ProfileBio() {
  const { client } = useStreamContext()
  const { feedUser, setFeedUser } = useFeed()
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false)
  const { paramUser, updateParamUser } = useParamUser()

  if (!feedUser?.data || !paramUser) return <LoadingIndicator />

  const joinedDate = format(new Date(paramUser.created_at), 'MMMM RRRR')
  const isLoggedInUserProfile = paramUser.data.id === client.userId

  const handleEditProfile = () => {
    setIsEditProfileOpen(true)
  }

  const handleProfileUpdate = (updatedUser) => {
    updateParamUser(updatedUser)
    setFeedUser(updatedUser)
    setIsEditProfileOpen(false)
  }

  const handleMoreButtonClick = () => {
    setIsMoreMenuOpen(!isMoreMenuOpen)
  }

  const followingCount =
    paramUser.following_count > 1 ? paramUser.following_count - 1 : 0
  const followersCount =
    paramUser.followers_count > 1 ? paramUser.followers_count - 1 : 0

  return (
    <Container>
      <div className="top">
        <div className="image">
          <UserImage
            src={paramUser.data?.image}
            alt={paramUser.data.name}
            username={paramUser.data.username}
          />
        </div>
        <div className="actions">
          {isLoggedInUserProfile ? (
            <>
              <button className="action-btn" onClick={handleMoreButtonClick}>
                <More color="white" size={21} />
              </button>
              {isMoreMenuOpen && (
                <ProfileMoreMenu onClose={() => setIsMoreMenuOpen(false)} />
              )}
              <ActionButton onClick={handleEditProfile}>
                Edit Profile
              </ActionButton>
            </>
          ) : (
            <FollowBtn userId={paramUser.data.id} />
          )}
        </div>
      </div>
      <div className="details">
        <span className="user__name">{paramUser.data.name}</span>
        <span className="user__id">@{paramUser.data.username}</span>
        <span className="user__bio">
          {formatStringWithLink(paramUser.data.bio || '')}
        </span>
        <div className="user__joined">
          <Calendar color="#777" size={20} />
          <span className="user__joined--text">Joined {joinedDate}</span>
        </div>
        <div className="user__follows">
          <span className="user__follows__following">
            <b>{followingCount}</b> Following
          </span>
          <span className="user__follows__followers">
            <b>{followersCount}</b> Followers
          </span>
        </div>
      </div>
      {isEditProfileOpen && (
        <Modal onClickOutside={() => setIsEditProfileOpen(false)}>
          <EditProfileView onSave={handleProfileUpdate} />
        </Modal>
      )}
    </Container>
  )
}
