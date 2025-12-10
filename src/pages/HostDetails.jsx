import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { loadStays } from '../store/actions/stay.actions'
import { StayPreview } from '../cmps/StayPreview'
import '../assets/styles/cmps/HostDetails.css'

export function HostDetails() {
  const { hostId } = useParams()
  const stays = useSelector(storeState => storeState.stayModule.stays)
  const [hostStays, setHostStays] = useState([])
  const [hostInfo, setHostInfo] = useState(null)
  const [isBioExpanded, setIsBioExpanded] = useState(false)
  

  useEffect(() => {
    loadStays()
  }, [hostId])

  // Filter stays by host ID when stays are loaded
  useEffect(() => {
    if (stays.length > 0) {
      const filtered = stays.filter(stay => stay.host?._id === hostId)
      setHostStays(filtered)
      if (filtered.length > 0) {
        setHostInfo(filtered[0].host)
      }
    }
  }, [stays, hostId])

  if (!hostInfo) {
    return <div className="host-details-loading">Loading...</div>
  }

  // Calculate host stats from all stays
  const totalReviews = hostStays.reduce((sum, stay) => sum + (stay.rating?.count || 0), 0)
  const avgRating = hostStays.reduce((sum, stay) => {
    const rating = stay.rating?.avg || 0
    const count = stay.rating?.count || 0
    return sum + (rating * count)
  }, 0) / (totalReviews || 1)
  const formattedRating = avgRating ? Number(avgRating).toFixed(2).replace(/\.0+$/, '').replace(/\.(\d)0$/, '.$1') : null
  
  // Calculate years hosting from oldest stay
  const oldestStay = hostStays.reduce((oldest, stay) => {
    if (!oldest) return stay
    return (stay.createdAt || 0) < (oldest.createdAt || 0) ? stay : oldest
  }, null)
  const yearsHosting = oldestStay?.createdAt 
    ? Math.floor((Date.now() - oldestStay.createdAt) / (1000 * 60 * 60 * 24 * 365))
    : 0

  const hostAvatar = hostInfo.imgUrl || (hostInfo.fullname ? `https://i.pravatar.cc/200?u=${encodeURIComponent(hostInfo.fullname)}` : 'https://i.pravatar.cc/200')
  
  // Mock host biography
  const hostBio = hostInfo.bio || `I am a passionate host who loves providing great stays for guests. With years of experience in hospitality, I ensure every guest feels welcome and comfortable during their stay.`
  const hostBioPreview = hostBio.slice(0, 300)
  const shouldTruncateBio = hostBio.length > 300
  const displayedBio = !shouldTruncateBio || isBioExpanded ? hostBio : `${hostBioPreview}...`

  // Mock host details
  const responseRate = hostInfo.responseRate || 100
  const responseTime = hostInfo.responseTime || 'within an hour'
  const languages = hostInfo.languages || ['English', 'Hebrew']
  const location = hostStays.length > 0 ? `${hostStays[0].loc?.city || ''}, ${hostStays[0].loc?.country || ''}`.trim().replace(/^,\s*|,\s*$/g, '') : ''

  return (
    <div className="host-details">
      <div className="host-details-container">
        {/* Header Section */}
        <header className="host-header">
          <div className="host-header-content">
            <div className="host-profile-section">
              <div className="host-avatar-large">
                <img src={hostAvatar} alt={`Host ${hostInfo.fullname}`} />
              </div>
              <div className="host-header-info">
                <div className="host-name-section">
                  <h1 className="host-name">{hostInfo.fullname}</h1>
                  {hostInfo.isSuperhost && (
                    <div className="host-superhost-badge-large">
                      <span className="superhost-star">★</span>
                      <span>Superhost</span>
                    </div>
                  )}
                </div>
                {location && (
                  <p className="host-location">{location}</p>
                )}
                <div className="host-stats-header">
                  {totalReviews > 0 && (
                    <>
                      <span className="host-stat-item">
                        <span className="host-stat-star">★</span>
                        {formattedRating || '0'}
                      </span>
                      <span className="host-stat-separator">·</span>
                      <span className="host-stat-item">{totalReviews} Reviews</span>
                    </>
                  )}
                  {yearsHosting > 0 && (
                    <>
                      <span className="host-stat-separator">·</span>
                      <span className="host-stat-item">{yearsHosting} Years hosting</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <button type="button" className="host-message-button-large">
              Contact host
            </button>
          </div>
        </header>

        {/* Bio Section */}
        <section className="host-bio-section">
          <h2>About</h2>
          <p className="host-bio-text">{displayedBio}</p>
          {shouldTruncateBio && (
            <button
              type="button"
              className="link-button"
              onClick={() => setIsBioExpanded(prev => !prev)}
            >
              {isBioExpanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </section>

        {/* Host Details Grid */}
        <section className="host-details-grid">
          <div className="host-detail-card">
            <div className="host-detail-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="24" height="24">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div className="host-detail-content">
              <h3>Response rate</h3>
              <p>{responseRate}%</p>
            </div>
          </div>

          <div className="host-detail-card">
            <div className="host-detail-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="24" height="24">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div className="host-detail-content">
              <h3>Response time</h3>
              <p>Responds {responseTime}</p>
            </div>
          </div>

          {languages.length > 0 && (
            <div className="host-detail-card">
              <div className="host-detail-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="24" height="24">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </div>
              <div className="host-detail-content">
                <h3>Languages</h3>
                <p>{languages.join(', ')}</p>
              </div>
            </div>
          )}

          {hostInfo.isSuperhost && (
            <div className="host-detail-card">
              <div className="host-detail-icon">
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <div className="host-detail-content">
                <h3>Superhost</h3>
                <p>Experienced, highly rated host</p>
              </div>
            </div>
          )}
        </section>

        {/* Listings Section */}
        {hostStays.length > 0 && (
          <section className="host-listings-section">
            <h2>{hostInfo.fullname}'s listings</h2>
            <div className="host-listings-grid">
              {hostStays.map(stay => (
                <StayPreview key={stay._id} stay={stay} />
              ))}
            </div>
          </section>
        )}

        {/* Safety Notice */}
        <section className="host-safety-notice">
          <div className="safety-notice-content">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
            <p>To help protect your payment, always use Urbnb to send money and communicate with hosts.</p>
          </div>
        </section>
      </div>
    </div>
  )
}

