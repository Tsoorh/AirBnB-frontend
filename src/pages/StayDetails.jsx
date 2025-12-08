import { useEffect, useRef, useState } from 'react'
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { addReviewToStay, loadStay, removeReviewFromStay } from '../store/actions/stay.actions'
import { ReviewList } from '../cmps/ReviewList'
import { ImageGallery } from '../cmps/ImageGallery'
import { BookingWidget } from '../cmps/BookingWidget'
import { AmenityIcon } from '../cmps/AmenityIcon'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { updateUser } from '../store/actions/user.actions'
import { updateStay } from '../store/actions/stay.actions'
import { userService } from '../services/user'
import dayjs from 'dayjs'
import { AddReviewModal } from '../cmps/modals/AddReviewModal'
import { findAndSetPrivateChat } from '../store/actions/chat.actions.js'

export function StayDetails() {
  const loggedInUser = useSelector(storeState => storeState.userModule.user)
  const { stayId } = useParams()
  const stay = useSelector(storeState => storeState.stayModule.stay)
  const [searchParams, setSearchParams] = useSearchParams()
  const reviewsSectionRef = useRef(null)
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [hostDetails, setHostDetails] = useState(null)
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const navigator = useNavigate()

  // Get dates from URL params and validate them
  const checkInParamRaw = searchParams.get('checkIn') || ''
  const checkOutParamRaw = searchParams.get('checkOut') || ''
  const checkInParam = checkInParamRaw && dayjs(checkInParamRaw).isValid() ? checkInParamRaw : ''
  const checkOutParam = checkOutParamRaw && dayjs(checkOutParamRaw).isValid() ? checkOutParamRaw : ''

  // State to control calendar months - left shows current/check-in month, right shows next month
  const getLeftMonth = () => checkInParam ? dayjs(checkInParam).startOf('month') : dayjs().startOf('month')
  const [leftMonth, setLeftMonth] = useState(getLeftMonth)
  const [rightMonth, setRightMonth] = useState(() => getLeftMonth().add(1, 'month'))

  // Update calendar months when check-in changes
  useEffect(() => {
    const newLeftMonth = getLeftMonth()
    setLeftMonth(newLeftMonth)
    setRightMonth(newLeftMonth.add(1, 'month'))
  }, [checkInParam])

  useEffect(() => {
    loadStay(stayId)
  }, [stayId]) 

  // Sync isLiked state with user's liked array
  useEffect(() => {
    if (loggedInUser && stay) {
      const liked = loggedInUser.liked?.includes(stay._id) || false
      setIsLiked(liked)
    } else {
      setIsLiked(false)
    }
  }, [loggedInUser, stay])
  

  // Fetch detailed host information
  useEffect(() => {
    async function fetchHostDetails() {
      if (stay?.host?._id) {
        try {
          const host = await userService.getById(stay.host._id)
          setHostDetails(host)
        } catch (err) {
          console.error('Failed to load host details:', err)
        }
      }
    }
    fetchHostDetails()
  }, [stay?.host?._id])

  if (!stay) {
    return <div className="stay-details-loading">Loading...</div>
  }


  const formattedRating = stay.rating?.avg
    ? Number(stay.rating?.avg).toFixed(2).replace(/\.0+$/, '').replace(/\.(\d)0$/, '.$1')
    : null
  const locationLabel = [stay.loc?.city, stay.loc?.country].filter(Boolean).join(', ')
  const capacityItems = [
    stay.capacity?.guests && `${stay.capacity.guests} ${stay.capacity.guests === 1 ? 'guest' : 'guests'}`,
    stay.capacity?.bedrooms && `${stay.capacity.bedrooms} ${stay.capacity.bedrooms === 1 ? 'bedroom' : 'bedrooms'}`,
    stay.capacity?.beds && `${stay.capacity.beds} ${stay.capacity.beds === 1 ? 'bed' : 'beds'}`,
    stay.capacity?.bathrooms && `${stay.capacity.bathrooms} ${stay.capacity.bathrooms === 1 ? 'bathroom' : 'bathrooms'}`
  ].filter(Boolean)
  // const checkOutTime = stay.checkOut?.by
  const hostAvatar = stay.host?.imgUrl || (stay.host?.fullname
    ? `https://i.pravatar.cc/120?u=${encodeURIComponent(stay.host.fullname)}`
    : 'https://i.pravatar.cc/120')

  const yearsHosting = stay.createdAt ? Math.floor((Date.now() - stay.createdAt) / (1000 * 60 * 60 * 24 * 365)) : 0

  const amenitiesPreview = stay.amenities?.slice(0, 10) || []
  const hasMoreAmenities = (stay.amenities?.length || 0) > amenitiesPreview.length
  const descriptionPreview = stay.summary?.slice(0, 350)
  const shouldTruncateDescription = stay.summary && stay.summary.length > 350
  const displayedDescription = !shouldTruncateDescription || isDescriptionExpanded ? stay.summary : `${descriptionPreview}...`

  function handleAddReview() {
    setReviewModalOpen(true)
  }

  function handleCloseReviewModal() {
    setReviewModalOpen(false)
  }

  async function onRemoveReview(reviewId) {
    try {
      await removeReviewFromStay(stay, reviewId)
      loadStay(stay._id)
      showSuccessMsg('Review removed successfully')
    } catch (err) {
      console.error('Error removing review:', err)
      showErrorMsg('Failed to remove review')
    }
  }

  async function hadleSumitReview(reviewData) {
    if (!loggedInUser) {
      showErrorMsg('Please login to add a review')
      return
    }
    try {
      const newReview = {
        _id: Date.now().toString(),
        txt: reviewData.text,
        rating: reviewData.rating,
        byUser: {
          _id: loggedInUser._id,
          fullname: loggedInUser.fullname,
          imgUrl: loggedInUser.imgUrl || `https://i.pravatar.cc/150?u=${loggedInUser._id}`
        },
        createdAt: Date.now()
      }
      await addReviewToStay(stay, newReview)
      loadStay(stay._id)
      setReviewModalOpen(false)
      showSuccessMsg('Review submitted successfully')
    } catch (err) {
      console.error('Error submitting review:', err)
      showErrorMsg('Failed to submit review')
    }
  }

  const handleShowReviews = () => {
    reviewsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  // Handle date selection from calendar - both calendars can select either date
  const handleDateChange = (ev) => {
    if (!ev || ev.$D === undefined || ev.$M === undefined || ev.$y === undefined) return
    const { $D, $M, $y } = ev
    const pickedDateFormatted = `${$y}-${String($M + 1).padStart(2, '0')}-${String($D).padStart(2, '0')}`
    if (!dayjs(pickedDateFormatted).isValid()) return
    const newParams = new URLSearchParams(searchParams)
    if (!checkInParam) {
      newParams.set('checkIn', pickedDateFormatted)
    } else if (!checkOutParam) {
      if (pickedDateFormatted <= checkInParam) {
        newParams.set('checkIn', pickedDateFormatted)
      } else {
        newParams.set('checkOut', pickedDateFormatted)
      }
    } else {
      if (pickedDateFormatted < checkInParam) {
        newParams.set('checkIn', pickedDateFormatted)
        if (pickedDateFormatted >= checkOutParam) {
          newParams.delete('checkOut')
        }
      } else if (pickedDateFormatted > checkOutParam) {
        newParams.set('checkOut', pickedDateFormatted)
      } else {
        const distToCheckIn = Math.abs(dayjs(pickedDateFormatted).diff(dayjs(checkInParam), 'day'))
        const distToCheckOut = Math.abs(dayjs(pickedDateFormatted).diff(dayjs(checkOutParam), 'day'))

        if (distToCheckIn <= distToCheckOut) {
          newParams.set('checkIn', pickedDateFormatted)
          if (pickedDateFormatted >= checkOutParam) {
            newParams.delete('checkOut')
          }
        } else {
          newParams.set('checkOut', pickedDateFormatted)
          if (pickedDateFormatted <= checkInParam) {
            newParams.set('checkIn', pickedDateFormatted)
            newParams.delete('checkOut')
          }
        }
      }
    }
    setSearchParams(newParams)
  }

  // Handle month navigation - keep calendars synchronized
  const handleLeftMonthChange = (newMonth) => {
    const newLeftMonth = dayjs(newMonth).startOf('month')
    const newRightMonth = newLeftMonth.add(1, 'month')
    setLeftMonth(newLeftMonth)
    setRightMonth(newRightMonth)
  }

  const handleRightMonthChange = (newMonth) => {
    const newRightMonth = dayjs(newMonth).startOf('month')
    const newLeftMonth = newRightMonth.subtract(1, 'month')
    setLeftMonth(newLeftMonth)
    setRightMonth(newRightMonth)
  }

  // Handle clear dates
  const handleClearDates = () => {
    const newParams = new URLSearchParams(searchParams)
    newParams.delete('checkIn')
    newParams.delete('checkOut')
    setSearchParams(newParams)
  }

  // Format dates for display
  const formatDateDisplay = (dateString) => {
    if (!dateString) return ''
    const date = dayjs(dateString)
    return date.isValid() ? date.format('MMM D, YYYY') : dateString
  }

  // Calculate nights
  const nights = checkInParam && checkOutParam ? dayjs(checkOutParam).diff(dayjs(checkInParam), 'day') : 0

  // Check if a date is unavailable
  const isDateUnavailable = (date) => {
    if (!stay?.unavailable || !date) return false
    return stay.unavailable.some(range => {
      const start = dayjs(range.startDate)
      const end = dayjs(range.endDate)
      const dateStr = date.format('YYYY-MM-DD')
      const startStr = start.format('YYYY-MM-DD')
      const endStr = end.format('YYYY-MM-DD')
      return dateStr >= startStr && dateStr <= endStr
    })
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

  //Send message to host 

  async function onHandleMessageHost() {
    const chatId =await findAndSetPrivateChat(stay.ownerId, loggedInUser)
    navigator(`/chat`, { state: { participant: stay.ownerId, chatId: chatId } })
  }

  return (
    <div className="stay-details">
      <header className="stay-details-header">
        <div className="header-main">
          <h1 className="stay-title">{stay.name}</h1>
        </div>

        <div className="header-actions">
          <button type="button" className="header-action-link">
            <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
              <polyline points="16 6 12 2 8 6"></polyline>
              <line x1="12" y1="2" x2="12" y2="15"></line>
            </svg>
            <span>Share</span>
          </button>
          <button type="button" className="header-action-link" onClick={handleHeartClick}>
            <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false" style={{ overflow: 'visible' }}>
              <path d="M12 21.35 10.55 20C5.4 15.36 2 12.27 2 8.5 2 5.42 4.42 3 7.5 3A4.49 4.49 0 0 1 12 5.09 4.49 4.49 0 0 1 16.5 3C19.58 3 22 5.42 22 8.5c0 3.77-3.4 6.86-8.55 11.54Z" fill={isLiked ? 'var(--clr6)' : 'none'} color={isLiked ? 'var(--clr6)' : 'none'} stroke="currentColor" strokeWidth="1.5" />
            </svg>
            {isLiked ? 'Saved' : 'Save'}
          </button>
        </div>
      </header>

      <ImageGallery images={stay.imgUrls} alt={stay.name} stayId={stay._id} />

      <div className="stay-main-content">
        <div className="stay-details-content">
          <section className="stay-summary-intro">
            <h2 className="stay-summary-title">
              {`Entire ${stay.type ? stay.type.toLowerCase() : 'stay'}${locationLabel ? ` in ${locationLabel}` : ''}`.trim()}
            </h2>

            {capacityItems.length > 0 && (
              <div className="stay-summary-capacity">
                {capacityItems.map((item, idx) => (
                  <span key={item} className="summary-capacity-item">
                    {item}
                    {idx < capacityItems.length - 1 && <span className="summary-dot">{'\u00b7'}</span>}
                  </span>
                ))}
              </div>
            )}

            {formattedRating && (
              <div className="stay-summary-rating">
                <span className="summary-star" aria-hidden="true">{'\u2605'}</span>
                <span className="summary-rating-value">{formattedRating}</span>
                <span className="summary-dot">{'\u00b7'}</span>
                <button type="button" onClick={handleShowReviews}>
                  {stay.reviews?.length
                    ? `${stay.reviews.length} reviews`
                    : 'Be the first to review'}
                </button>
              </div>
            )}
          </section>

          <div className="stay-content">
            <section className="stay-overview">
              {stay.host && (
                <Link to={`/host/${stay.host._id}`} className="stay-host-card">
                  <div className="stay-host-avatar">
                    <img src={hostAvatar} alt={`Host ${stay.host.fullname}`} />
                  </div>
                </Link>
              )}

              <div className="overview-text">
                <h2>{stay.host ? `Hosted by ${stay.host.fullname}` : 'Hosted by Airbnb Host'}</h2>
                {stay.host?.isSuperhost && (
                  <span className="overview-superhost">Superhost</span>
                )}
              </div>
            </section>

            {stay.labels?.length > 0 && (
              <section className="stay-highlights">
                {stay.labels.map((label, idx) => (
                  <div key={`${label.title}-${idx}`} className="stay-highlight-item">
                    <p className="highlight-title">{label.title}</p>
                    <p className="highlight-description">{label.description}</p>
                  </div>
                ))}
              </section>
            )}

            {stay.summary && (
              <section className="stay-description">
                <p>{displayedDescription}</p>
                {shouldTruncateDescription && (
                  <button
                    type="button"
                    className="link-button"
                    onClick={() => setIsDescriptionExpanded(prev => !prev)}
                  >
                    {isDescriptionExpanded ? 'Show less' : 'Show more'}
                  </button>
                )}
              </section>
            )}

            {stay.amenities?.length > 0 && (
              <section className="stay-amenities">
                <h3>What this place offers</h3>
                <div className="stay-amenities-grid">
                  {amenitiesPreview.map(amenity => (
                    <div key={amenity} className="stay-amenity">
                      <span className="amenity-icon" aria-hidden="true">
                        <AmenityIcon amenity={amenity} />
                      </span>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
                {hasMoreAmenities && (
                  <button type="button" className="link-button">
                    Show all amenities
                  </button>
                )}
              </section>
            )}

            <section className="stay-date-selection">
              <div className="date-selection-header">
                <h3>
                  {(checkInParam && checkOutParam && nights > 0)
                    ? `${nights} ${nights === 1 ? 'night' : 'nights'} in ${locationLabel || 'this location'}`
                    : 'Select check-in date'
                  }
                </h3>
                <p className="date-selection-subtitle">
                  {(checkInParam && checkOutParam) ? (
                    ` ${formatDateDisplay(checkInParam)} - ${formatDateDisplay(checkOutParam)}`
                  ) : 'Add your travel dates for exact pricing'}
                </p>
              </div>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div className="date-calendars-container">
                  <div className="date-calendar-wrapper">
                    <DateCalendar
                      key={`left-${leftMonth.format('YYYY-MM')}`}
                      value={checkInParam ? dayjs(checkInParam) : null}
                      onChange={handleDateChange}
                      minDate={dayjs()}
                      disablePast
                      shouldDisableDate={(date) => date?.isValid() && isDateUnavailable(date)}
                      onMonthChange={handleLeftMonthChange}
                      referenceDate={leftMonth}
                    />
                  </div>
                  <div className="date-calendar-wrapper">
                    <DateCalendar
                      key={`right-${rightMonth.format('YYYY-MM')}`}
                      value={checkOutParam ? dayjs(checkOutParam) : null}
                      onChange={handleDateChange}
                      minDate={dayjs()}
                      disablePast
                      shouldDisableDate={(date) => date?.isValid() && isDateUnavailable(date)}
                      onMonthChange={handleRightMonthChange}
                      referenceDate={rightMonth}
                    />
                  </div>
                </div>
              </LocalizationProvider>
              {(checkInParam || checkOutParam) && (
                <button type="button" className="clear-dates-button" onClick={handleClearDates}>
                  Clear dates
                </button>
              )}
            </section>
          </div>
        </div>
        <aside className="stay-sidebar">
          <BookingWidget />
        </aside>
      </div>

      <section className="stay-reviews" ref={reviewsSectionRef}>
        <div className="reviews-header">
          {formattedRating && stay.reviews && (
            <div className="reviews-summary">
              <span className="reviews-star" aria-hidden="true">{'\u2605'}</span>
              <span>{formattedRating}</span>
              <span className="reviews-dot">{'\u00b7'}</span>
              {stay.reviews?.length && <span>{stay.reviews.length} reviews</span>}
            </div>
          )}
        </div>
        {stay.reviews?.length ? (
          <ReviewList reviews={stay.reviews} onRemoveReview={onRemoveReview} />
        ) : (
          <p className="no-reviews">No reviews yet</p>
        )}
        <button className="add-review-btn" onClick={handleAddReview}>Add review</button>
      </section>

      {/* Review Modal */}
      {reviewModalOpen && (<AddReviewModal hadleSumitReview={hadleSumitReview} handleCloseReviewModal={handleCloseReviewModal} />)}

      {stay.loc && (
        <section className="stay-location">
          <h2>Where you&apos;ll be</h2>
          <div className="stay-location-content">
            <div className="stay-location-text">
              <p className="location-address">{stay.loc.address}</p>
              {locationLabel && <p className="location-city">{locationLabel}</p>}
            </div>
            {stay.loc.lat && stay.loc.lng && (
              <div className="stay-map-container">
                <iframe
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${stay.loc.lng - 0.01},${stay.loc.lat - 0.01},${stay.loc.lng + 0.01},${stay.loc.lat + 0.01}&layer=mapnik&marker=${stay.loc.lat},${stay.loc.lng}`}
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  title={`Map of ${stay.loc.address}`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            )}
          </div>
        </section>
      )}

      {stay.host && (
        <section className="stay-meet-host">
          <h2>Meet your host</h2>
          <div className="meet-host-content">
            <div className="host-profile-section">
              <Link to={`/host/${stay.host._id}`} className="host-profile-card">
                <div className='host-pic'>
                  <img className="host-profile-avatar" src={hostAvatar} alt={`Host ${stay.host.fullname}`} />
                  <h3 className="host-profile-name">{stay.host.fullname}</h3>
                  {stay.host.isSuperhost && (
                    <div className="host-profile-superhost">
                      <span className="superhost-star">★</span>
                      <span>Superhost</span>
                    </div>
                  )}
                </div>
                  <div className="host-profile-stats">
                    <p className="host-stat-reviews">
                      {stay.reviews?.length || 0} 
                      <br />
                      <span className='describe-rate'>Reviews</span>
                    </p>
                    <p className="host-stat-rating">
                      {formattedRating || '0'} ★
                      <br />
                      <span className='describe-rate'>Rating</span>
                    </p>
                    {yearsHosting > 0 && (
                      <p className="host-stat-years">
                        {yearsHosting} 
                        <span className='describe-rate'>Years hosting</span>
                      </p>
                    )}
                </div>
              </Link>
                <div className="host-profile-details">
                {/* <div className="host-detail-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
                    <path d="M9 21h6M12 3a6 6 0 0 1 6 6c0 2.22-1.78 4-4 4H10c-2.22 0-4-1.78-4-4a6 6 0 0 1 6-6z" />
                    <path d="M12 7v2M12 11v2" />
                  </svg>
                  <span>Born in the 90s</span>
                </div> */}

                {hostDetails?.languages && (
                  <div className="host-detail-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    <span>
                        Speaks {hostDetails.languages.length > 1 
                        ? hostDetails.languages.slice(0, -1).join(", ") + " and " + hostDetails.languages.slice(-1)
                        : hostDetails.languages[0]
                      }
                    </span>
                  </div>
                )}
                {hostDetails?.work && (
                    <div className="host-detail-item">
                      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" width="14" height="14">
                        <path d="M20 2a2 2 0 0 1 2 1.85V6h6a3 3 0 0 1 3 2.82V27a3 3 0 0 1-2.82 3H4a3 3 0 0 1-3-2.82V9a3 3 0 0 1 2.82-3H10V4a2 2 0 0 1 1.85-2H12zm8 6H4a1 1 0 0 0-1 .88V12a3 3 0 0 0 2.82 3H13v2H6a4.98 4.98 0 0 1-3-1v11a1 1 0 0 0 .88 1H28a1 1 0 0 0 1-.88V16c-.78.59-1.74.95-2.78 1h-7.17v-2H26a3 3 0 0 0 3-2.82V9a1 1 0 0 0-.88-1zm-10 4a1 1 0 0 1 1 .88V19a1 1 0 0 1-.88 1H14a1 1 0 0 1-1-.88V13a1 1 0 0 1 .88-1H14zm-1 2h-2v4h2zm3-10h-8v2h8z"></path>
                      </svg>
                      <span>
                          My work: {hostDetails.work} 
                      </span>
                    </div>
                )}
              </div>

              {hostDetails?.bio && (
                <div className="host-biography">
                  <p>{hostDetails.bio}</p>
                </div>
                )}
            </div>
            <div className="host-info-section">
              {stay.host.isSuperhost && (
                <div className="host-superhost-info">
                  <h4>{stay.host.fullname} is a Superhost</h4>
                  <p>Superhosts are experienced, highly rated hosts who are committed to providing great stays for guests.</p>
                </div>
              )}

            {hostDetails?.responseRate !== undefined && (
                  <div className="host-details-info">
                  <h4>Host details</h4>
                  <p>Response rate: {hostDetails.responseRate}%</p>
                  {hostDetails?.responseTime && (<p>Responds {hostDetails.responseTime}</p>)}
                </div>
            )}

              <button type="button" className="host-message-button" onClick={onHandleMessageHost}>
                Message host
              </button>
              <div className="host-payment-protection">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
                <span>To help protect your payment, always use Airbnb to send money and communicate with hosts.</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {(stay.houseRules?.length || stay.safety?.length || stay.cancellationPolicy?.length) > 0 && (
        <section className="stay-things-to-know">
          <h2>Things to know</h2>
          <div className="things-grid">
            <div className="thing-column">
              <h4>House rules</h4>
              <ul>
                <li>{`Check-in after ${stay.checkIn.from}`}</li>
                <li>{`Check-in before ${stay.checkOut.by}`}</li>
                {stay.houseRules.map((rule, idx) => (
                  <li key={idx}>{rule}</li>
                ))}
              </ul>
            </div>
            <div className="thing-column">
              <h4>Safety & property</h4>
              <ul>
                {stay.safety.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="thing-column">
              <h4>Cancellation policy</h4>
              <div>
                {stay.cancellationPolicy ? (stay.cancellationPolicy) : 'ask the host'}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
