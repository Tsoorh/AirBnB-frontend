import React from 'react'

export function StayDetailsNavBar({ sections, visible, showReserve, stay, onReserveClick, orderParams }) {
    
    function onScrollToSection(ref) {
        if (ref.current) {
            // Offset for the fixed header height (approx 80px)
            const y = ref.current.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    }
    
    const nights = orderParams?.nights || 0
    const priceDisplay = stay?.price?.base ? `₪${stay.price.base}` : ''
    const subText = nights > 0 ? `for ${nights} ${nights === 1 ? 'night' : 'nights'}` : 'for 1 night'

    return (
        <div className={`stay-details-navbar ${visible ? 'visible' : ''}`}>
            <div className="navbar-inner">
                <nav className="navbar-links">
                    {sections.map(section => (
                        <button 
                            key={section.id} 
                            onClick={() => onScrollToSection(section.ref)}
                            className="navbar-link"
                        >
                            {section.label}
                        </button>
                    ))}
                </nav>

                {showReserve && stay && (
                    <div className="navbar-reserve">
                        <div className="navbar-reserve-info">
                            <div className="navbar-price-container">
                                <span className="price">{priceDisplay}</span>
                                <span className="period">{subText}</span>
                            </div>
                            <div className="navbar-rating">
                                <span className="star">★</span>
                                <span className="rating">{stay.rating?.avg}</span>
                                <span className="rating-separator">{'\u00b7'}</span>
                                <span className="reviews">{stay.reviews?.length} reviews</span>
                            </div>
                        </div>
                        <button className="navbar-reserve-btn" onClick={onReserveClick}>
                            Reserve
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

