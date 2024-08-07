import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStreamContext } from 'react-activity-feed'
import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css'
import styled from 'styled-components'
import axios from 'axios'

import { updateProfileImage } from '../../contexts/auth/AuthSlice'
import { useAuth } from '../../contexts/auth/useAuth'

const PlaceholderSVG = ({ onClick }) => (
  <StyledPlaceholderSVG
    onClick={onClick}
    xmlns="http://www.w3.org/2000/svg"
    fill="white"
    viewBox="0 0 16 16"
  >
    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
    <path
      fillRule="evenodd"
      d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
    />
  </StyledPlaceholderSVG>
)

const UserImage = ({
  src,
  alt,
  username,
  userId,
  clickable = true,
  expandable = false,
}) => {
  const navigate = useNavigate()
  const { authState } = useAuth()
  const { client } = useStreamContext()
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [imageSrc, setImageSrc] = useState(src)

  useEffect(() => {
    const handleImageRefresh = async () => {
      console.log('handleImageRefresh triggered')
      if (!client || !client.images) {
        console.error(
          'Feed client is not initialized or missing images property'
        )
        return
      }

      if (imageSrc && imageSrc.includes('googleusercontent.com')) {
        console.log('Google image detected, replacing with Stream image')
        const newImageUrl = await uploadImageToStream(
          imageSrc,
          userId,
          client,
          authState.authUser.feedToken
        )
        setImageSrc(newImageUrl)
      } else if (imageSrc && imageSrc.includes('stream-io-cdn.com')) {
        console.log('Stream image detected, checking for expiration')
        const url = new URL(imageSrc)
        const params = new URLSearchParams(url.search)
        const expires = params.get('Expires')
        const now = Math.floor(Date.now() / 1000)

        console.log(
          'expires',
          expires,
          'now',
          now,
          'url',
          url,
          'params',
          params,
          'client',
          client
        )
        if (expires && now > parseInt(expires)) {
          console.log('Stream image URL expired, refreshing')
          const newImageUrl = await refreshStreamImageUrl(imageSrc, client)
          setImageSrc(newImageUrl)
        }
      }
    }

    handleImageRefresh()
  }, [imageSrc, userId, client, authState.authUser.feedToken])

  const handleClick = (e) => {
    if (clickable && username) {
      e.stopPropagation()
      navigate(`/${username}`)
    } else if (expandable) {
      setIsLightboxOpen(true)
    }
  }

  return (
    <Container>
      {imageSrc ? (
        <StyledImage src={imageSrc} alt={alt} onClick={handleClick} />
      ) : (
        <PlaceholderSVG onClick={handleClick} />
      )}
      {isLightboxOpen && (
        <Lightbox
          key={imageSrc}
          mainSrc={imageSrc}
          onCloseRequest={() => setIsLightboxOpen(false)}
        />
      )}
    </Container>
  )
}

const uploadImageToStream = async (imageUrl, userId, client, feedToken) => {
  try {
    const response = await axios({
      url: imageUrl,
      method: 'GET',
      responseType: 'blob',
    })

    const file = new File([response.data], 'profile.jpg', {
      type: response.data.type,
    })

    const streamResponse = await client.images.upload(file)
    const streamImageUrl = streamResponse.file

    await updateProfileImage({ userId, imageUrl: streamImageUrl }, feedToken)

    return streamImageUrl
  } catch (error) {
    console.error(
      'Error uploading image to Stream:',
      error.response ? error.response.data : error.message
    )
    return imageUrl // Fallback to the original URL if there's an error
  }
}

const refreshStreamImageUrl = async (imageUrl, client) => {
  try {
    console.log('Refreshing Stream image URL:', imageUrl)
    const newImageUrl = await client.images.refreshUrl(imageUrl)
    console.log('Stream image URL refreshed:', newImageUrl)
    return newImageUrl
  } catch (error) {
    console.error(
      'Error refreshing Stream image URL:',
      error.response ? error.response.data : error.message
    )
    return imageUrl // Fallback to the original URL if there's an error
  }
}

export default UserImage

const Container = styled.div`
  display: flex;
  border-radius: 50%;
`

const StyledImage = styled.img`
  object-fit: cover;
  cursor: pointer;
  border-radius: 50%;
`

const StyledPlaceholderSVG = styled.svg`
  cursor: pointer;
`
