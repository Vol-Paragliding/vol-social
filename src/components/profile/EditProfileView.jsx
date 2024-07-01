import React, { useState, useRef } from 'react'
import styled from 'styled-components'

import UserImage from '../profile/UserImage'
import { useAuth } from '../../contexts/auth/useAuth'
import { useFeed } from '../../contexts/feed/useFeed'
import { useChat } from '../../contexts/chat/useChat'
import { updateUser, uploadImage } from '../../services/FeedService'

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

const ProfileImageContainer = styled.div`
  width: 140px;
  height: 140px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #444;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;

  &:hover {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  }

  img,
  svg {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const CoverImageContainer = styled.div`
  width: 100%;
  height: 150px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f3f3f3;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;

  &:hover {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const FileInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
  z-index: -1;
`

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`

export const EditProfileView = ({ onSave }) => {
  const { authState } = useAuth()
  const { feedUser, setFeedUser, setViewMode } = useFeed()
  const { chatClient } = useChat()

  const [userData, setUserData] = useState({
    name: feedUser?.data?.name || '',
    bio: feedUser?.data?.bio || '',
    location: feedUser?.data?.location || '',
  })
  const [selectedFile, setSelectedFile] = useState(null)
  const [imageSrc, setImageSrc] = useState(feedUser?.data?.image)
  const [coverFile, setCoverFile] = useState(null)
  const [coverImageSrc, setCoverImageSrc] = useState(
    feedUser?.data?.coverPhoto || null
  )

  const fileInputRef = useRef(null)
  const coverInputRef = useRef(null)

  const handleInputChange = (event, field) => {
    setUserData({ ...userData, [field]: event.target.value })
  }

  const handleImageContainerClick = () => fileInputRef.current?.click()
  const handleCoverContainerClick = () => coverInputRef.current?.click()

  const handleFileChange = (event, isCover = false) => {
    const file = event.target.files?.[0]
    if (file) {
      if (isCover) {
        setCoverFile(file)
        setCoverImageSrc(URL.createObjectURL(file))
      } else {
        setSelectedFile(file)
        setImageSrc(URL.createObjectURL(file))
      }
    }
  }

  const handleUpload = async (file) => {
    if (!file) return null
    try {
      const { name: fileName, type: mimeType } = file
      return uploadImage(
        fileName,
        mimeType,
        file,
        authState.authUser?.userId || '',
        authState.authUser?.feedToken || ''
      )
    } catch (error) {
      console.error('Error uploading image: ', error)
      return null
    }
  }

  const handleSubmit = async () => {
    if (!userData) {
      console.error('No user data to submit.')
      return
    }

    try {
      const imageUrl = selectedFile
        ? await handleUpload(selectedFile)
        : imageSrc
      const coverUrl = coverFile ? await handleUpload(coverFile) : coverImageSrc
      const updatedUserData = {
        ...userData,
        image: imageUrl?.toString() ?? userData.image,
        coverPhoto: coverUrl?.toString() ?? userData.coverPhoto,
      }

      const updatedUser = await updateUser(
        updatedUserData,
        authState.authUser?.userId || '',
        authState.authUser?.feedToken || ''
      )

      const userId = authState.authUser?.userId
      if (chatClient && userId) {
        await chatClient.upsertUser({
          id: userId,
          name: userId,
          ...updatedUserData,
        })
      } else {
        console.error('Chat client is not initialized or userId is undefined.')
      }

      setFeedUser(updatedUser)
      onSave(updatedUser)
    } catch (error) {
      console.error('Error updating user: ', error)
    }
  }

  return (
    <ProfileContainer>
      <form
        style={{ width: '100%' }}
        onSubmit={(e) => e.preventDefault()}
      >
        <ModalHeader>
          <ProfileHeader>Edit profile</ProfileHeader>
        </ModalHeader>

        <CoverImageContainer onClick={handleCoverContainerClick}>
          <FileInput
            type="file"
            onChange={(e) => handleFileChange(e, true)}
            accept="image/*"
            ref={coverInputRef}
          />
          {coverImageSrc ? (
            <img src={coverImageSrc} alt="Cover" />
          ) : (
            <p style={{ color: 'black' }}>Update cover image</p>
          )}
        </CoverImageContainer>
        <ProfileImageContainer onClick={handleImageContainerClick}>
          <FileInput
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            ref={fileInputRef}
          />
          <UserImage src={imageSrc} alt={feedUser?.data?.name} />
        </ProfileImageContainer>
        <FormField>
          <FormLabel htmlFor="name">Name</FormLabel>
          <FormInput
            id="name"
            name="name"
            value={userData.name}
            onChange={(e) => handleInputChange(e, 'name')}
            placeholder="Name"
          />
        </FormField>
        <FormField>
          <FormInput
            id="location"
            name="location"
            value={userData.location}
            onChange={(e) => handleInputChange(e, 'location')}
            placeholder="Location"
          />
        </FormField>
        <FormField>
          <TextArea
            id="bio"
            name="bio"
            value={userData.bio}
            onChange={(e) => handleInputChange(e, 'bio')}
            placeholder="Bio"
          />
        </FormField>
        <ActionButton save onClick={handleSubmit}>
          Save
        </ActionButton>
      </form>
    </ProfileContainer>
  )
}
