import PropTypes from 'prop-types'
import { useMemo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSearchParams } from "react-router-dom"
import { useSelector } from 'react-redux'
import { updateUser } from '../store/actions/user.actions'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { updateStay } from '../store/actions/stay.actions'

export function StayPreview({ stay, showLikeButton = true, inSearchPage = false }) {
    const price = stay.price?.base || 0
    const [searchParams] = useSearchParams()
    const loggedInUser = useSelector(storeState => storeState.userModule.user)
    const [isLiked, setIsLiked] = useState(false)
    const { isGuestFavorite } = stay
    const [currentImgIndex, setCurrentImgIndex] = useState(0)

    useEffect(() => {
        if (loggedInUser && loggedInUser.liked) {
            setIsLiked(loggedInUser.liked.includes(stay._id))
        } else {
            setIsLiked(false)
        }
    }, [loggedInUser, stay._id])

    // Generate consistent dates based on stay ID for demo purposes
    const { startDate, endDate, nights, totalPrice } = useMemo(() => {
        const seed = stay._id?.charCodeAt(0) || 0
        const startDate = new Date()
        startDate.setDate(startDate.getDate() + (seed % 30))
        const endDate = new Date(startDate)
        endDate.setDate(endDate.getDate() + ((seed % 4) + 1))
        const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
        const totalPrice = price * nights

        return { startDate, endDate, nights, totalPrice }
    }, [stay._id, price])

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }

    const handleHeartClick = async (ev) => {
        ev.preventDefault()
        ev.stopPropagation()
        if (!loggedInUser) {
            showErrorMsg('Please login to like stays')
            return
        }
        try {
            const newIsLiked = !isLiked
            setIsLiked(newIsLiked)

            const updatedUserLiked = newIsLiked
                ? [...(loggedInUser.liked || []), stay._id]
                : (loggedInUser.liked || []).filter(id => id !== stay._id)

            const updatedUser = {
                ...loggedInUser,
                liked: updatedUserLiked
            }

            const updatedStayLikedBy = newIsLiked
            ? [...(stay.likedByUserIds || []), loggedInUser._id]
            : (stay.likedByUserIds || []).filter(id => id !== loggedInUser._id)

            const updatedStay = {
                ...stay,
                likedByUserIds: updatedStayLikedBy
            }

            await Promise.all([
                updateUser(updatedUser),
                updateStay(updatedStay)
            ])


            showSuccessMsg(newIsLiked ? 'Added to favorites' : 'Removed from favorites')
        } catch (err) {
            setIsLiked(!isLiked)
            showErrorMsg('Could not update favorites')
            console.error('Error updating favorites:', err)
        }
    }

    const onNextImg = (ev) => {
        ev.preventDefault()
        ev.stopPropagation()
        const imgCount = stay.imgUrls?.length || 0
        if (imgCount <= 1) return
        setCurrentImgIndex(prev => (prev === imgCount - 1 ? 0 : prev + 1))
    }

    const onPrevImg = (ev) => {
        ev.preventDefault()
        ev.stopPropagation()
        const imgCount = stay.imgUrls?.length || 0
        if (imgCount <= 1) return
        setCurrentImgIndex(prev => (prev === 0 ? imgCount - 1 : prev - 1))
    }

    const onDotClick = (ev, idx) => {
        ev.preventDefault()
        ev.stopPropagation()
        setCurrentImgIndex(idx)
    }

    const hasMultipleImages = stay.imgUrls?.length > 1

    return (
        <Link to={`/stay/${stay._id}?${searchParams}`} className="stay-preview-link">
            <article className="stay-preview">
                <div className="stay-image-container">
                    {inSearchPage && hasMultipleImages ? (
                        <>
                            <div className="carousel-control prev" onClick={onPrevImg}>
                                <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{display: 'block', fill: 'none', height: '12px', width: '12px', stroke: 'currentColor', strokeWidth: 5.33333, overflow: 'visible'}}><path fill="none" d="M20 28 8.7 16.7a1 1 0 0 1 0-1.4L20 4"></path></svg>
                            </div>
                            <div className="carousel-control next" onClick={onNextImg}>
                                <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{display: 'block', fill: 'none', height: '12px', width: '12px', stroke: 'currentColor', strokeWidth: 5.33333, overflow: 'visible'}}><path fill="none" d="m12 4 11.3 11.3a1 1 0 0 1 0 1.4L12 28"></path></svg>
                            </div>
                            
                            <img 
                                src={stay.imgUrls[currentImgIndex]} 
                                alt={stay.name}
                                className="stay-image"
                            />
                            
                            <div className="carousel-dots">
                                {stay.imgUrls.map((_, idx) => {
                                   if (idx > 4) return null 
                                   return (
                                     <span 
                                         key={idx} 
                                         className={`dot ${currentImgIndex === idx ? 'active' : ''}`}
                                         onClick={(ev) => onDotClick(ev, idx)}
                                     ></span>
                                   )
                                })}
                            </div>
                        </>
                    ) : (
                        <img 
                            src={stay.imgUrls?.[0] || '/img/sunflowers.jpg'} 
                            alt={stay.name}
                            className="stay-image"
                        />
                    )}

                    {showLikeButton && (
                        <button className="heart-icon" type="button" onClick={handleHeartClick}>
                            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{display: 'block', fill: isLiked ? 'var(--clr6)' : 'rgba(0, 0, 0, 0.5)', height: '24px', width: '24px', stroke: 'white', strokeWidth: 2, overflow: 'visible'}}>
                                <path d="m15.9998 28.6668c7.1667-4.8847 14.3334-10.8844 14.3334-18.1088 0-1.84951-.6993-3.69794-2.0988-5.10877-1.3996-1.4098-3.2332-2.11573-5.0679-2.11573-1.8336 0-3.6683.70593-5.0668 2.11573l-2.0999 2.11677-2.0988-2.11677c-1.3995-1.4098-3.2332-2.11573-5.06783-2.11573-1.83364 0-3.66831.70593-5.06683 2.11573-1.39955 1.41083-2.09984 3.25926-2.09984 5.10877 0 7.2244 7.16667 13.2241 14.3333 18.1088z"></path>
                            </svg>
                        </button>
                    )}
                    {isGuestFavorite && (
                        <div className="guest-favorite-badge">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                            Guest favorite
                        </div>
                    )}
                </div>
                
                <div className="stay-info">
                    <h3 className="stay-title">{stay.name}</h3>
                    <p className="stay-dates">{formatDate(startDate)} - {formatDate(endDate)}</p>
                    <div className="stay-price-rating">₪{totalPrice} for {nights} night{nights > 1 ? 's' : ''}
                        {stay.rating?.avg && (
                            <span className="stay-rating">
                                <span className="star">★</span>
                                {stay.rating.avg.toFixed(2)}
                            </span>
                        )}
                    </div>
                </div>
            </article>
        </Link>
    )
}

StayPreview.propTypes = {
    stay: PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.string,
        imgUrls: PropTypes.arrayOf(PropTypes.string),
        price: PropTypes.shape({
            base: PropTypes.number,
            currency: PropTypes.string
        }),
        loc: PropTypes.shape({
            city: PropTypes.string,
            country: PropTypes.string
        }),
        rating: PropTypes.shape({
            avg: PropTypes.number
        }),
        likedByUserIds: PropTypes.arrayOf(PropTypes.string)
    }).isRequired,
    showLikeButton: PropTypes.bool,
    inSearchPage: PropTypes.bool
}