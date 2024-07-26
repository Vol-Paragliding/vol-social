import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css'

const PlaceholderSVG = ({ onClick }) => (
  <svg
    onClick={onClick}
    style={{ cursor: 'pointer' }}
    xmlns="http://www.w3.org/2000/svg"
    fill="white"
    viewBox="0 0 16 16"
  >
    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
    <path
      fillRule="evenodd"
      d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
    />
  </svg>
)

const UserImage = ({ src, alt, username, clickable = true }) => {
  const navigate = useNavigate()
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [key, setKey] = useState(0)

    useEffect(() => {
      setTimeout(() => setKey(key + 1))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLightboxOpen])

  const handleClick = (e) => {
    if (clickable && username) {
      e.stopPropagation()
      navigate(`/${username}`)
    } else {
      setIsLightboxOpen(true)
    }
  }

  return (
    <div>
      {src ? (
        <img
          style={{ objectFit: 'cover', cursor: 'pointer' }}
          src={src}
          alt={alt}
          onClick={handleClick}
        />
      ) : (
        <PlaceholderSVG onClick={handleClick} />
      )}
      {isLightboxOpen && (
        <Lightbox
          key={src}
          mainSrc={src}
          onCloseRequest={() => setIsLightboxOpen(false)}
        />
      )}
    </div>
  )
}

export default UserImage
