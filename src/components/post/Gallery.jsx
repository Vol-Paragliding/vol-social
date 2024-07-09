import React, { useState, useEffect } from 'react'
import classNames from 'classnames'
import Lightbox from 'react-image-lightbox'
// import 'react-image-lightbox/style.css'
// TODO: fix console.js:288 React-Modal: Cannot register modal instance that's already open
export const Gallery = ({ images = [], className }) => {
  const [index, setIndex] = useState(null)
  const [key, setKey] = useState(false)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  useEffect(() => {
    setTimeout(() => setKey(key + 1))
  }, [isLightboxOpen])

  return (
    <div
      className={classNames('raf-gallery', className)}
      style={{ border: 'none' }}
    >
      {images.slice(0, 5).map((image, i) => (
        <div
          role="button"
          className={classNames('img', {
            'img--last': i === 4 && images.length > 5,
          })}
          onClick={() => {
            setIsLightboxOpen(prev => !prev)
            setIndex(i)
          }}
          key={`image-${i}`}
        >
          <img src={image} className="raf-gallery__image" alt="" />
          {i === 4 && images.length > 5 && <p>{images.length - 4} more</p>}
        </div>
      ))}

      {index !== null && (
        <Lightbox
          key={key}
          mainSrc={images[index]}
          nextSrc={images[index + 1]}
          prevSrc={images[index - 1]}
          onCloseRequest={() => setIndex(null)}
          onMoveNextRequest={() => setIndex(index + 1)}
          onMovePrevRequest={() => setIndex(index - 1)}
        />
      )}
    </div>
  )
}
