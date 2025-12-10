import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { loadStays } from '../store/actions/stay.actions'
import { StayList } from '../cmps/StayList'
import { StayIndexSkeleton } from '../cmps/Skeletons'

export function StayIndex() {
    const stays = useSelector(storeState => storeState.stayModule.stays)
    const [cityScrollPositions, setCityScrollPositions] = useState({})
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)

    // Calculate responsive stay count based on window width
    const getStaysPerRow = () => {
        if(windowWidth <= 800 ) return 2
        if(windowWidth <=1000) return 4
        if (windowWidth <= 1190) return 5
        if (windowWidth <= 1439) return 6
        if (windowWidth >=1440) return 7
    }

    const staysPerRow = getStaysPerRow()

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth)
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        loadStays()
    }, [])

    // Function to handle scroll navigation
    const handleScroll = (city, direction) => {
        const currentPosition = cityScrollPositions[city] || 0
        const staysForCity = staysByCity[city] || []
        
        let newPosition
        if (direction === 'left') {
            newPosition = Math.max(0, currentPosition - 1)
        } else {
            newPosition = Math.min(staysForCity.length - staysPerRow, currentPosition + 1)
        }
        
        setCityScrollPositions(prev => ({
            ...prev,
            [city]: newPosition
        }))
    }


    // Group stays by city and sort by rating
    const staysByCity = stays.reduce((acc, stay) => {
        const city = stay.loc?.city || 'Unknown'
        acc[city] = acc[city] || []
        acc[city].push(stay)
        return acc
    }, {})

    // Sort stays within each city by rating (highest first)
    Object.keys(staysByCity).forEach(city => {
        staysByCity[city].sort((a, b) => {
            const ratingA = a.rating?.avg || 0
            const ratingB = b.rating?.avg || 0
            return ratingB - ratingA 
        })
    })

    // Get unique cities and limit to 6 rows
    const cities = Object.keys(staysByCity).slice(0, 6)

    if (!stays?.length) {
        return <StayIndexSkeleton staysPerRow={staysPerRow} rows={6} />
    }

    return (
        <section className="stay-index">
            {cities.map(city => {
                const staysForCity = staysByCity[city] || []
                const currentPosition = cityScrollPositions[city] || 0
                const visibleStays = staysForCity.slice(currentPosition, currentPosition + staysPerRow)
                const canScrollLeft = currentPosition > 0
                const canScrollRight = currentPosition < staysForCity.length - staysPerRow

                return (
                    <div key={city} className="city-section">
                        <div className="city-header">
                            <h2 className="city-title">Stay near {city}</h2>
                            <div className="navigation-arrows">
                                <button 
                                    className={`nav-arrow nav-arrow-left ${!canScrollLeft ? 'disabled' : ''}`}
                                    type="button"
                                    onClick={() => handleScroll(city, 'left')}
                                    disabled={!canScrollLeft}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M15 18l-6-6 6-6"/>
                                    </svg>
                                </button>
                                <button 
                                    className={`nav-arrow nav-arrow-right ${!canScrollRight ? 'disabled' : ''}`}
                                    type="button"
                                    onClick={() => handleScroll(city, 'right')}
                                    disabled={!canScrollRight}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M9 18l6-6-6-6"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <StayList stays={visibleStays} />
                    </div>
                )
            })}
        </section>
    )
}