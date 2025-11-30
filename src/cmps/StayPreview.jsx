import PropTypes from 'prop-types'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSearchParams } from "react-router-dom";


export function StayPreview({ stay }) {
    const price = stay.price?.base || 0
    const [searchParams] = useSearchParams()
    const [isLiked, setIsLiked] = useState(false)

    
    // Generate consistent dates based on stay ID for demo purposes
    const { startDate, endDate, nights, totalPrice, isGuestFavorite } = useMemo(() => {
        const seed = stay._id?.charCodeAt(0) || 0
        const startDate = new Date()
        startDate.setDate(startDate.getDate() + (seed % 30))
        const endDate = new Date(startDate)
        endDate.setDate(endDate.getDate() + ((seed % 5) + 1))
        
        const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
        const totalPrice = price * nights
        const isGuestFavorite = (seed % 3) === 0
        
        return { startDate, endDate, nights, totalPrice, isGuestFavorite }
    }, [stay._id, price])
    
    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }

    const handleHeartClick = (ev) => {
        ev.preventDefault()
        ev.stopPropagation()
        setIsLiked(!isLiked)
    }

    return (
        <Link to={`/stay/${stay._id}?${searchParams}`} className="stay-preview-link">
            <article className="stay-preview">
                <div className="stay-image-container">
                    <img 
                        src={stay.imgUrls?.[0] || '/img/sunflowers.jpg'} 
                        alt={stay.name}
                        className="stay-image"
                    />
                    <button className="heart-icon" type="button" onClick={handleHeartClick}>
                        <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{display: 'block', fill: isLiked ? 'var(--clr6)' : 'rgba(0, 0, 0, 0.5)', height: '24px', width: '24px', stroke: 'white', strokeWidth: 2, overflow: 'visible'}}>
                            <path d="m15.9998 28.6668c7.1667-4.8847 14.3334-10.8844 14.3334-18.1088 0-1.84951-.6993-3.69794-2.0988-5.10877-1.3996-1.4098-3.2332-2.11573-5.0679-2.11573-1.8336 0-3.6683.70593-5.0668 2.11573l-2.0999 2.11677-2.0988-2.11677c-1.3995-1.4098-3.2332-2.11573-5.06783-2.11573-1.83364 0-3.66831.70593-5.06683 2.11573-1.39955 1.41083-2.09984 3.25926-2.09984 5.10877 0 7.2244 7.16667 13.2241 14.3333 18.1088z"></path>
                        </svg>
                    </button>
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
        })
    }).isRequired
}
