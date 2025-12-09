import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import '../assets/styles/cmps/ImageGallery.css'

export function ImageGallery({ images, alt, stayId }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showLightbox, setShowLightbox] = useState(false)

  const handleImageClick = (index) => {
    setCurrentImageIndex(index)
    setShowLightbox(true)
  }

  const handleCloseLightbox = () => {
    setShowLightbox(false)
  }

  const handlePrevImage = (e) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNextImage = (e) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  // Keyboard navigation
  useEffect(() => {
    if (!showLightbox) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowLightbox(false)
      }
      if (e.key === 'ArrowLeft') {
        e.stopPropagation()
        setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
      }
      if (e.key === 'ArrowRight') {
        e.stopPropagation()
        setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showLightbox, images.length])

  if (!images || images.length === 0) {
    return (
      <div className="image-gallery">
        <div className="main-image-container">
          <img
            src="/img/sunflowers.jpg"
            alt={alt || "No image available"}
            className="main-image"
          />
        </div>
      </div>
    )
  }

  // Show lightbox modal with single image navigation
  if (showLightbox) {
    return (
      <div className="lightbox-modal" onClick={handleCloseLightbox}>
        <button
          className="lightbox-close-button"
          onClick={handleCloseLightbox}
        >
          X Close
        </button>

        <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
          {images.length > 1 && (
            <button
              className="lightbox-nav-button lightbox-prev"
              onClick={handlePrevImage}
            >
              ‹
            </button>
          )}

          <div className="lightbox-image-container">
            <img
              src={images[currentImageIndex]}
              alt={`${alt || 'Image'} ${currentImageIndex + 1}`}
              className="lightbox-image"
            />
            <div className="lightbox-counter">
              {currentImageIndex + 1} / {images.length}
            </div>
          </div>

          {images.length > 1 && (
            <button
              className="lightbox-nav-button lightbox-next"
              onClick={handleNextImage}
            >
              ›
            </button>
          )}
        </div>
      </div>
    )
  }


  return (
    <div className="image-gallery">
      <div className="gallery-grid">
        {/* Main large image */}
        <div 
          className="main-image-container"
          onClick={() => handleImageClick(0)}
        >
          <img 
            src={images[0]} 
            alt={alt || `Image 1`}
            className="main-image"
          />
        </div>
        
        {/* 4 smaller images - always show 4 images */}
        <div className="small-images-grid">
          {Array.from({ length: 4 }, (_, index) => {
            const imageIndex = index + 1
            const imageUrl = images[imageIndex] || images[0] // fallback to first image if not enough images
            
            return (
              <div 
                key={imageIndex}
                className="small-image-container"
                onClick={() => handleImageClick(imageIndex)}
              >
                <img
                  src={imageUrl}
                  alt={`${alt || 'Image'} ${imageIndex + 1}`}
                  className="small-image"
                />
                {/* Show "Show all photos" button on the last small image if there are more than 5 images */}
                {index === 3 && images.length > 5 && (
                  <Link to={`/stay/${stayId}/photos`} className="show-all-photos-button">
                    Show all photos
                  </Link>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
