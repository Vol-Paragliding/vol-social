import React, { useState } from 'react'
import styled from 'styled-components'
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

  .details-container {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }

  .details {
    flex: 1;
    color: #888;

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

  .extra-details-right {
    margin-left: auto;

    .label {
      color: rgb(136, 136, 136);
      display: block;
      margin-top: 10px;
      font-size: 15px;
    }

    .value {
      color: var(--theme-color);
      font-size: 14px;
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

const CertificationContainer = styled.div`
  margin-top: 10px;

  .certification {
    display: flex;
    align-items: center;
    margin-bottom: 5px;

    .label {
      margin-right: 10px;
      font-size: 15px;
    }

    .value {
      color: var(--theme-color);
      font-size: 14px;
    }
  }
`

const ContactContainer = styled.div`
  margin-top: 10px;

  .label {
    margin-right: 10px;
    font-size: 15px;
  }

  .value {
    color: var(--theme-color) !important;
    margin-bottom: 5px;
    font-size: 12px;
  }
`

export default function ProfileBio() {
  const { client } = useStreamContext()
  const { feedUser, setFeedUser } = useFeed()
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false)
  const { paramUser, updateParamUser } = useParamUser()

  if (!feedUser?.data || !paramUser) return <LoadingIndicator />

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
            src={paramUser.data?.profile?.image}
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
      <div className="details-container">
        <div className="details">
          <div>
            <span className="user__name">{paramUser.data.name}</span>
            <span className="user__id">@{paramUser.data.username}</span>
            {paramUser.data.profile?.bio && (
              <span className="user__bio">
                {formatStringWithLink(paramUser.data.profile.bio)}
              </span>
            )}
          </div>
          <div style={{ display: 'flex' }}>
            <div>
              <div className="user__follows">
                <span className="user__follows__following">
                  <b>{followingCount}</b> Following
                </span>
                <span className="user__follows__followers">
                  <b>{followersCount}</b> Followers
                </span>
              </div>
              {paramUser.data.profile?.yearStartedFlying && (
                <div className="user__joined">
                  <Calendar color="#777" size={20} />
                  <span className="user__joined--text">
                    Flying since: {paramUser.data.profile.yearStartedFlying}
                  </span>
                </div>
              )}
              <CertificationContainer>
                {paramUser.data.profile?.certifications?.p && (
                  <div className="certification">
                    <span className="label">Paragliding:</span>
                    <span className="value">
                      {paramUser.data.profile.certifications.p}
                    </span>
                  </div>
                )}
                {paramUser.data.profile?.certifications?.h && (
                  <div className="certification">
                    <span className="label">Hang Gliding:</span>
                    <span className="value">
                      {paramUser.data.profile.certifications.h}
                    </span>
                  </div>
                )}
                {paramUser.data.profile?.certifications?.s && (
                  <div className="certification">
                    <span className="label">Speed Flying:</span>
                    <span className="value">
                      {paramUser.data.profile.certifications.s}
                    </span>
                  </div>
                )}
                {paramUser.data.profile?.certifications?.t && (
                  <div className="certification">
                    <span className="label">Tandem:</span>
                    <span className="value">
                      {paramUser.data.profile.certifications.t}
                    </span>
                  </div>
                )}
              </CertificationContainer>
              <ContactContainer>
                {paramUser.data.profile?.inReachSocial && (
                  <div>
                    <div className="label">InReach Social:</div>
                    <div className="value">
                      {paramUser.data.profile.inReachSocial}
                    </div>
                  </div>
                )}
                {paramUser.data.profile?.inReachEmail && (
                  <div>
                    <div className="label">InReach Email:</div>
                    <div className="value">
                      {paramUser.data.profile.inReachEmail}
                    </div>
                  </div>
                )}
                {paramUser.data.profile?.xContestProfile && (
                  <div>
                    <div className="label">XContest Profile:</div>
                    <div className="value">
                      {paramUser.data.profile.xContestProfile}
                    </div>
                  </div>
                )}
                {paramUser.data.profile?.telegramUsername && (
                  <div>
                    <div className="label">Telegram Username:</div>
                    <div className="value">
                      {paramUser.data.profile.telegramUsername}
                    </div>
                  </div>
                )}
              </ContactContainer>
            </div>
            <div className="extra-details-right">
              {paramUser.data.profile?.wings?.length > 0 && (
                <div>
                  <div className="label">Wings:</div>
                  {paramUser.data.profile.wings.map((wing, index) => (
                    <div key={index} className="value">
                      {wing}
                    </div>
                  ))}
                </div>
              )}
              {paramUser.data.profile?.harnesses?.length > 0 && (
                <div>
                  <div className="label">Harnesses:</div>
                  {paramUser.data.profile.harnesses.map((harness, index) => (
                    <div key={index} className="value">
                      {harness}
                    </div>
                  ))}
                </div>
              )}

              {paramUser.data.profile?.favoriteSites?.length > 0 && (
                <div>
                  <div className="label">Favorite Flying Sites:</div>
                  {paramUser.data.profile.favoriteSites.map((site, index) => (
                    <div key={index} className="site">
                      <span className="value">{site}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
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
