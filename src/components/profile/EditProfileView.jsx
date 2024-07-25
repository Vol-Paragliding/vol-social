import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useAuth } from '../../contexts/auth/useAuth'
import { useFeed } from '../../contexts/feed/useFeed'
import { useChat } from '../../contexts/chat/useChat'
import { updateUser, uploadImage } from '../../services/FeedService'
import { checkAvailability, updateProfile } from '../../contexts/auth/AuthSlice'
import { Certifications } from './Certifications'
import { ProfileImageUpload } from './ProfileImageUpload'
import ProfileList from './ProfileList'
import ProfileInput from './ProfileInput'

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  width: 600px;
  color: #fff;
  overflow-y: auto;
`

const ProfileHeader = styled.h2`
  font-size: 1.5rem;
  color: #fff;
  margin-bottom: 10px;
`

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #555;
  border-radius: 4px;
  box-sizing: border-box;
  background-color: black;
  color: #fff;
  margin-bottom: 10px;
  font-size: 14px;
  height: 100px;

  &:focus {
    outline: 2px solid var(--theme-color);
  }
`

const ActionButton = styled.button`
  padding: 0.75rem 2rem;
  margin-top: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s, transform 0.1s;
  width: 100%;
  background-color: var(--theme-color);
  color: black;
  font-weight: bold;
  display: flex;
  justify-content: center;
`

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`

export const EditProfileView = ({ onSave }) => {
  const navigate = useNavigate()
  const { authState } = useAuth()
  const { feedUser } = useFeed()
  const { chatClient } = useChat()

  const [profileData, setProfileData] = useState({
    id: feedUser?.data?.id || authState.authUser?.user.id || '',
    username:
      feedUser?.data?.username || authState.authUser?.user.username || '',
    name: feedUser?.data?.name || '',
    email: feedUser?.data?.email || '',
    profile: feedUser?.data?.profile || {
      bio: '',
      location: '',
      image: '',
      coverPhoto: '',
      yearStartedFlying: '',
      certifications: {
        p: '',
        h: '',
        s: '',
        t: '',
      },
      favoriteSites: [],
      wings: [],
      harnesses: [],
      inReachSocial: '',
      inReachEmail: '',
      xContestProfile: '',
      telegramUsername: '',
    },
  })

  const [selectedFile, setSelectedFile] = useState(null)
  const [imageSrc, setImageSrc] = useState(feedUser?.data?.profile?.image)
  const [coverFile, setCoverFile] = useState(null)
  const [coverImageSrc, setCoverImageSrc] = useState(
    feedUser?.data?.profile?.coverPhoto || null
  )
  const [isLoading, setIsLoading] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [usernameError, setUsernameError] = useState('')

  const handleProfileChange = (event, field) => {
    setProfileData({
      ...profileData,
      profile: {
        ...profileData.profile,
        [field]: event.target.value,
      },
    })
  }

  const handleRootChange = (event, field) => {
    setProfileData({
      ...profileData,
      [field]: event.target.value,
    })
  }

  const handleImageChange = (file) => {
    setSelectedFile(file)
    setImageSrc(URL.createObjectURL(file))
  }

  const handleCoverImageChange = (file) => {
    setCoverFile(file)
    setCoverImageSrc(URL.createObjectURL(file))
  }

  const handleUpload = async (file) => {
    if (!file) return null
    try {
      const { name: fileName, type: mimeType } = file
      return uploadImage(
        fileName,
        mimeType,
        file,
        profileData.id,
        authState.authUser?.feedToken || ''
      )
    } catch (error) {
      console.error('Error uploading image: ', error)
      return null
    }
  }

  const handleCertificationChange = (event, category) => {
    const value = event.target.value
    setProfileData((prevState) => ({
      ...prevState,
      profile: {
        ...prevState.profile,
        certifications: {
          ...prevState.profile.certifications,
          [category]: value,
        },
      },
    }))
  }

  const handleAvailabilityCheck = async (identifier, type) => {
    if (
      (type === 'email' && identifier !== authState.authUser?.user.email) ||
      (type === 'username' && identifier !== authState.authUser?.user.username)
    ) {
      try {
        const isAvailable = await checkAvailability(identifier)
        if (!isAvailable) {
          if (type === 'email') {
            setEmailError('Email is already in use')
          } else {
            setUsernameError('Username is already in use')
          }
        } else {
          if (type === 'email') {
            setEmailError('')
          } else {
            setUsernameError('')
          }
        }
        return isAvailable
      } catch (error) {
        console.error(`Error checking ${type} availability: `, error)
        if (type === 'email') {
          setEmailError('Error checking email availability')
        } else {
          setUsernameError('Error checking username availability')
        }
        return false
      }
    }
    return true
  }

  const handleSubmit = async () => {
    if (!profileData) {
      console.error('No user data to submit.')
      return
    }

    setIsLoading(true)

    try {
      const imageUrl = selectedFile
        ? await handleUpload(selectedFile)
        : imageSrc
      const coverUrl = coverFile ? await handleUpload(coverFile) : coverImageSrc
      const updatedUserData = {
        ...profileData,
        profile: {
          ...profileData.profile,
          image: imageUrl?.toString() ?? profileData.profile.image,
          coverPhoto: coverUrl?.toString() ?? profileData.profile.coverPhoto,
        },
      }

      const updatedUser = await updateUser(
        updatedUserData,
        profileData.id,
        authState.authUser?.feedToken || ''
      )

      if (chatClient && profileData.id) {
        await chatClient.upsertUser({
          id: profileData.id,
          ...updatedUserData,
        })
      } else {
        console.error('Chat client is not initialized or userId is undefined.')
      }

      await updateProfile(updatedUserData, authState.authUser?.feedToken || '')

      onSave(updatedUser)
    } catch (error) {
      console.error('Error updating user: ', error)
    } finally {
      setIsLoading(false)
      navigate(`/${profileData.username}`)
    }
  }

  return (
    <ProfileContainer>
      <form style={{ width: '100%' }} onSubmit={(e) => e.preventDefault()}>
        <ModalHeader>
          <ProfileHeader>Edit profile</ProfileHeader>
        </ModalHeader>
        <ProfileImageUpload
          imageSrc={imageSrc}
          coverImageSrc={coverImageSrc}
          onImageChange={handleImageChange}
          onCoverImageChange={handleCoverImageChange}
        />
        <ProfileInput
          style={{ marginTop: '80px' }}
          label="Display Name"
          value={profileData.name}
          onChange={(e) => handleRootChange(e, 'name')}
          placeholder="Name"
        />
        <ProfileInput
          label="Username"
          value={profileData.username}
          onChange={(e) => handleRootChange(e, 'username')}
          placeholder="User ID"
          onBlur={(e) => handleAvailabilityCheck(e.target.value, 'username')}
        />
        {usernameError && <div style={{ color: 'red' }}>{usernameError}</div>}
        <ProfileInput
          value={profileData.email}
          onChange={(e) => handleRootChange(e, 'email')}
          placeholder="Email"
          onBlur={(e) => handleAvailabilityCheck(e.target.value, 'email')}
        />
        {emailError && <div style={{ color: 'red' }}>{emailError}</div>}
        <ProfileInput
          value={profileData.profile.location}
          onChange={(e) => handleProfileChange(e, 'location')}
          placeholder="Location"
        />
        <TextArea
          id="bio"
          name="bio"
          value={profileData.profile.bio}
          onChange={(e) => handleProfileChange(e, 'bio')}
          placeholder="Bio"
        />
        <ProfileInput
          style={{ marginBottom: '20px' }}
          value={profileData.profile.yearStartedFlying}
          onChange={(e) => handleProfileChange(e, 'yearStartedFlying')}
          placeholder="Year Started Flying"
          type="number"
          min="1900"
          max={new Date().getFullYear()}
        />
        <Certifications
          certifications={profileData.profile.certifications}
          handleCertificationChange={handleCertificationChange}
        />
        <ProfileList
          label="Favorite Flying Sites"
          items={profileData.profile.favoriteSites}
          setItems={(favoriteSites) =>
            setProfileData({
              ...profileData,
              profile: {
                ...profileData.profile,
                favoriteSites,
              },
            })
          }
          placeholder="Favorite Flying Site"
        />
        <ProfileList
          label="Gear"
          items={profileData.profile.wings}
          setItems={(wings) =>
            setProfileData({
              ...profileData,
              profile: {
                ...profileData.profile,
                wings,
              },
            })
          }
          placeholder="Wing"
        />
        <ProfileList
          items={profileData.profile.harnesses}
          setItems={(harnesses) =>
            setProfileData({
              ...profileData,
              profile: {
                ...profileData.profile,
                harnesses,
              },
            })
          }
          placeholder="Harness"
        />
        <ProfileInput
          label="Contacts"
          value={profileData.profile.inReachSocial || ''}
          onChange={(e) => handleProfileChange(e, 'inReachSocial')}
          placeholder="https://share.garmin.com/your_name"
        />
        <ProfileInput
          value={profileData.profile.inReachEmail || ''}
          onChange={(e) => handleProfileChange(e, 'inReachEmail')}
          placeholder="john1234@inreach.garmin.com"
        />
        <ProfileInput
          value={profileData.profile.xContestProfile || ''}
          onChange={(e) => handleProfileChange(e, 'xContestProfile')}
          placeholder="https://www.xcontest.org/world/en/pilots/detail:your_name"
        />
        <ProfileInput
          value={profileData.profile.telegramUsername || ''}
          onChange={(e) => handleProfileChange(e, 'telegramUsername')}
          placeholder="Telegram Username"
        />
        <ActionButton
          save
          onClick={handleSubmit}
          disabled={isLoading || usernameError || emailError}
        >
          {isLoading ? 'Saving...' : 'Save'}
        </ActionButton>
      </form>
    </ProfileContainer>
  )
}
