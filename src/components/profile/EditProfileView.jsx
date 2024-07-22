import React, { useState } from 'react'
import styled from 'styled-components'
import { useAuth } from '../../contexts/auth/useAuth'
import { useFeed } from '../../contexts/feed/useFeed'
import { useChat } from '../../contexts/chat/useChat'
import { updateUser, uploadImage } from '../../services/FeedService'
import { ProfileImageUpload } from './ProfileImageUpload'

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

const FormField = styled.div`
  width: 100%;
  margin-bottom: 10px;
`

const FormLabel = styled.label`
  color: #ccc;
  font-size: 16px;
`

const FormInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #555;
  border-radius: 4px;
  box-sizing: border-box;
  background-color: black;
  color: #fff;
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: bold;

  &:focus {
    outline: 2px solid var(--theme-color);
  }
`

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #555;
  border-radius: 4px;
  box-sizing: border-box;
  background-color: black;
  color: #fff;
  margin-bottom: 16px;
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
  const { authState } = useAuth()
  const { feedUser } = useFeed()
  const { chatClient } = useChat()

  const [profileData, setProfileData] = useState({
    id: feedUser?.data?.id || authState.authUser?.user.id || '',
    username:
      feedUser?.data?.username || authState.authUser?.user.username || '',
    name: feedUser?.data?.name || '',
    email: feedUser?.data?.email || '',
    bio: feedUser?.data?.bio || '',
    location: feedUser?.data?.location || '',
    image: feedUser?.data?.image || '',
    coverPhoto: feedUser?.data?.coverPhoto || '',
  })
  const [selectedFile, setSelectedFile] = useState(null)
  const [imageSrc, setImageSrc] = useState(feedUser?.data?.image)
  const [coverFile, setCoverFile] = useState(null)
  const [coverImageSrc, setCoverImageSrc] = useState(
    feedUser?.data?.coverPhoto || null
  )
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (event, field) => {
    setProfileData({ ...profileData, [field]: event.target.value })
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
        image: imageUrl?.toString() ?? profileData.image,
        coverPhoto: coverUrl?.toString() ?? profileData.coverPhoto,
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

      onSave(updatedUser)
    } catch (error) {
      console.error('Error updating user: ', error)
    } finally {
      setIsLoading(false)
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
        <FormField style={{ marginTop: '80px' }}>
          <FormLabel htmlFor="name">Display name</FormLabel>
          <FormInput
            id="name"
            name="name"
            value={profileData.name}
            onChange={(e) => handleInputChange(e, 'name')}
            placeholder="Name"
            maxLength="25"
          />
        </FormField>
        <FormField>
          <FormLabel htmlFor="username">Username</FormLabel>
          <FormInput
            id="username"
            name="username"
            value={profileData.username}
            onChange={(e) => handleInputChange(e, 'username')}
            placeholder="User ID"
            maxLength="25"
          />
        </FormField>
        <FormField>
          <FormInput
            id="email"
            name="email"
            value={profileData.email}
            onChange={(e) => handleInputChange(e, 'email')}
            placeholder="Email"
            maxLength="25"
          />
        </FormField>
        <FormField>
          <FormInput
            id="location"
            name="location"
            value={profileData.location}
            onChange={(e) => handleInputChange(e, 'location')}
            placeholder="Location"
          />
        </FormField>
        <FormField>
          <TextArea
            id="bio"
            name="bio"
            value={profileData.bio}
            onChange={(e) => handleInputChange(e, 'bio')}
            placeholder="Bio"
          />
        </FormField>
        <ActionButton save onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save'}
        </ActionButton>
      </form>
    </ProfileContainer>
  )
}
