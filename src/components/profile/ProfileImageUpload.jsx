import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import UserImage from '../profile/UserImage'

const ProfileImageContainer = styled.div`
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #444;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
  margin-top: calc(var(--profile-image-size) / -2);
  margin-left: 20px;
  width: var(--profile-image-size);
  height: var(--profile-image-size);
  border: 4px solid black;
  position: absolute;

  &:hover {
    background-color: #333;
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
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #ddd;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
  height: 200px;

  &:hover {
    background-color: #333;
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

export const ProfileImageUpload = ({
  imageSrc,
  coverImageSrc,
  onImageChange,
  onCoverImageChange,
}) => {
  const fileInputRef = useRef(null)
  const coverInputRef = useRef(null)

  const handleImageContainerClick = () => fileInputRef.current?.click()
  const handleCoverContainerClick = () => coverInputRef.current?.click()

  const handleFileChange = (event, isCover = false) => {
    const file = event.target.files?.[0]
    if (file) {
      if (isCover) {
        onCoverImageChange(file)
      } else {
        onImageChange(file)
      }
    }
  }

  return (
    <>
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
          <p>Update cover photo</p>
        )}
      </CoverImageContainer>
      <ProfileImageContainer onClick={handleImageContainerClick}>
        <FileInput
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          ref={fileInputRef}
        />
        <UserImage src={imageSrc} alt="Profile image" userId={null} />
      </ProfileImageContainer>
    </>
  )
}
