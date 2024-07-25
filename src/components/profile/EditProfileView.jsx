import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useAuth } from '../../contexts/auth/useAuth'
import { useFeed } from '../../contexts/feed/useFeed'
import { useChat } from '../../contexts/chat/useChat'
import { updateUser, uploadImage } from '../../services/FeedService'
import { updateProfile } from '../../contexts/auth/AuthSlice'
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

const Dropdown = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #555;
  border-radius: 4px;
  box-sizing: border-box;
  background-color: black;
  color: #fff;
  margin-bottom: 16px;
  font-size: 16px;

  &:focus {
    outline: 2px solid var(--theme-color);
  }
`

const FavoriteSitesContainer = styled.div`
  width: 100%;
  margin-bottom: 16px;
`

const FavoriteSiteInput = styled.input`
  width: calc(100% - 36px);
  padding: 10px;
  border: 1px solid #555;
  border-radius: 4px;
  box-sizing: border-box;
  background-color: black;
  color: #fff;
  margin-right: 8px;
  font-size: 16px;

  &:focus {
    outline: 2px solid var(--theme-color);
  }
`

const AddSiteButton = styled.button`
  padding: 10px;
  border: 1px solid #555;
  border-radius: 4px;
  background-color: var(--theme-color);
  color: black;
  cursor: pointer;

  &:hover {
    background-color: #555;
  }
`

const RemoveSiteButton = styled.button`
  padding: 10px;
  border: none;
  background: none;
  color: red;
  cursor: pointer;
  font-size: 16px;
  margin-left: 8px;
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

const CertificationsContainer = styled.div`
  width: 100%;
  margin-bottom: 16px;
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
    bio: feedUser?.data?.bio || '',
    location: feedUser?.data?.location || '',
    image: feedUser?.data?.image || '',
    coverPhoto: feedUser?.data?.coverPhoto || '',
    yearStartedFlying: feedUser?.data?.yearStartedFlying || '',
    certifications: feedUser?.data?.certifications || {
      p: '',
      h: '',
      s: '',
      t: '',
    },
    favoriteSites: feedUser?.data?.favoriteSites || [],
  })
  const [selectedFile, setSelectedFile] = useState(null)
  const [imageSrc, setImageSrc] = useState(feedUser?.data?.image)
  const [coverFile, setCoverFile] = useState(null)
  const [coverImageSrc, setCoverImageSrc] = useState(
    feedUser?.data?.coverPhoto || null
  )
  const [isLoading, setIsLoading] = useState(false)
  const [newFavoriteSite, setNewFavoriteSite] = useState('')

  const handleInputChange = (event, field) => {
    setProfileData({ ...profileData, [field]: event.target.value })
  }

  const handleFavoriteSiteChange = (event) => {
    setNewFavoriteSite(event.target.value)
  }

  const handleFavoriteSiteKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      addFavoriteSite()
    }
  }

  const addFavoriteSite = () => {
    if (newFavoriteSite) {
      setProfileData({
        ...profileData,
        favoriteSites: [...profileData.favoriteSites, newFavoriteSite],
      })
      setNewFavoriteSite('')
    }
  }

  const removeFavoriteSite = (index) => {
    const updatedSites = profileData.favoriteSites.filter((_, i) => i !== index)
    setProfileData({ ...profileData, favoriteSites: updatedSites })
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
    setProfileData({
      ...profileData,
      certifications: {
        ...profileData.certifications,
        [category]: event.target.value,
      },
    })
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
        <FormField>
          <FormInput
            id="yearStartedFlying"
            name="yearStartedFlying"
            value={profileData.yearStartedFlying}
            onChange={(e) => handleInputChange(e, 'yearStartedFlying')}
            placeholder="Year Started Flying"
            type="number"
            min="1900"
            max={new Date().getFullYear()}
          />
        </FormField>
        <CertificationsContainer>
          <FormField>
            <FormLabel htmlFor="pCertification">Paragliding</FormLabel>
            <Dropdown
              id="pCertification"
              name="p"
              value={profileData.certifications.p}
              onChange={(e) => handleCertificationChange(e, 'p')}
            >
              <option value="">Select Certification</option>
              <option value="p1">P1</option>
              <option value="p2">P2</option>
              <option value="p3">P3</option>
              <option value="p4">P4</option>
              <option value="p5">P5</option>
            </Dropdown>
          </FormField>
          <FormField>
            <FormLabel htmlFor="hCertification">Hang Gliding</FormLabel>
            <Dropdown
              id="hCertification"
              name="h"
              value={profileData.certifications.h}
              onChange={(e) => handleCertificationChange(e, 'h')}
            >
              <option value="">Select Certification</option>
              <option value="h1">H1</option>
              <option value="h2">H2</option>
              <option value="h3">H3</option>
              <option value="h4">H4</option>
              <option value="h5">H5</option>
            </Dropdown>
          </FormField>
          <FormField>
            <FormLabel htmlFor="sCertification">Speed Flying</FormLabel>
            <Dropdown
              id="sCertification"
              name="s"
              value={profileData.certifications.s}
              onChange={(e) => handleCertificationChange(e, 's')}
            >
              <option value="">Select Certification</option>
              <option value="s1">S1</option>
              <option value="s2">S2</option>
              <option value="s3">S3</option>
              <option value="s4">S4</option>
            </Dropdown>
          </FormField>
          <FormField>
            <FormLabel htmlFor="tCertification">Tandem</FormLabel>
            <Dropdown
              id="tCertification"
              name="t"
              value={profileData.certifications.t}
              onChange={(e) => handleCertificationChange(e, 't')}
            >
              <option value="">Select Certification</option>
              <option value="t1">T1</option>
              <option value="t3">T3</option>
            </Dropdown>
          </FormField>
        </CertificationsContainer>
        <FavoriteSitesContainer>
          <FormLabel>Favorite Flying Sites</FormLabel>
          {profileData.favoriteSites.map((site, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '10px',
              }}
            >
              <FavoriteSiteInput
                value={site}
                onChange={(e) => {
                  const updatedSites = profileData.favoriteSites.slice()
                  updatedSites[index] = e.target.value
                  setProfileData({
                    ...profileData,
                    favoriteSites: updatedSites,
                  })
                }}
                placeholder="Favorite Flying Site"
              />
              <RemoveSiteButton onClick={() => removeFavoriteSite(index)}>
                ✕
              </RemoveSiteButton>
            </div>
          ))}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '10px',
            }}
          >
            <FavoriteSiteInput
              value={newFavoriteSite}
              onChange={handleFavoriteSiteChange}
              onKeyPress={handleFavoriteSiteKeyPress}
              placeholder="Add a new favorite site"
            />
            <AddSiteButton onClick={addFavoriteSite}>Add</AddSiteButton>
          </div>
        </FavoriteSitesContainer>
        <ActionButton save onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save'}
        </ActionButton>
      </form>
    </ProfileContainer>
  )
}
