import { useState } from 'react'

export function AddReviewModal({ handleCloseReviewModal, hadleSumitReview }) {
    const [review, setReview] = useState({
        rating: 0,
        text: ''
    })

    const handleRatingClick = (rating) => {
        setReview(prev => ({ ...prev, rating }))
    }

    const handleTextChange = (e) => {
        setReview(prev => ({ ...prev, text: e.target.value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (review.rating === 0) {
            alert('Please select a rating')
            return
        }
        if (!review.text.trim()) {
            alert('Please write a review')
            return
        }
        hadleSumitReview(review)
    }

    return (
        <div className="review-modal-overlay" onClick={handleCloseReviewModal}>
          <div className="review-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={handleCloseReviewModal}>×</button>
            <h2>Add a Review</h2>
            <form className="review-form" onSubmit={handleSubmit}>
              <div className="rating-section">
                <label>Rating</label>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      className={`star-btn ${star <= review.rating ? 'active' : ''}`}
                      onClick={() => handleRatingClick(star)}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div className="review-text-section">
                <label htmlFor="review-text">Your Review</label>
                <textarea
                  id="review-text"
                  rows="6"
                  placeholder="Share your experience..."
                  value={review.text}
                  onChange={handleTextChange}
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={handleCloseReviewModal}>Cancel</button>
                <button type="submit" className="submit-review-btn">Submit Review</button>
              </div>
            </form>
          </div>
        </div>
    )
}
