import PropTypes from 'prop-types'

export function ReviewPreview({ review }) {
    const { byUser, rating } = review  
    console.log("by user:", byUser);
      

    return <article className="review-preview">
        <div className="review-header">
            <div className="reviewer-info">
                <div className="reviewer-avatar">
                    {byUser?.imgUrl ? (
                        <img src={byUser.imgUrl} alt={byUser.fullname} />
                    ) : (
                        <div className="avatar-placeholder">
                            {byUser?.fullname?.charAt(0) || '?'}
                        </div>
                    )}
                </div>
                <div className="reviewer-details">
                    <h4 className="reviewer-name">{byUser?.fullname || 'Anonymous'}</h4>
                    <p className="review-date">
                        {review.createdAt ? new Date(review.createdAt).toLocaleDateString('he-IL') : 'Recently'}
                    </p>
                </div>
            </div>
            {review.rating && (
                <div className="review-rating">
                    <div className="rating-stars">
                        {Array.from({ length: 5 }, (_, i) => (
                            <span 
                                key={i} 
                                className={`star ${i < review.rating ? 'filled' : 'empty'}`}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
        <div className="review-content">
            <p className="review-text">{review.txt}</p>
        </div>
    </article>
}

ReviewPreview.propTypes = {
    review: PropTypes.shape({
        _id: PropTypes.string,
        txt: PropTypes.string.isRequired,
        rating: PropTypes.number,
        createdAt: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        byUser: PropTypes.shape({
            _id: PropTypes.string,
            fullname: PropTypes.string,
            imgUrl: PropTypes.string
        }),
        aboutStay: PropTypes.shape({
            _id: PropTypes.string,
            name: PropTypes.string
        })
    }).isRequired
}