import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export function StaySearchSkeleton({ itemsCount = 20 }) {
    return (
        <section className="stay-search">
            <div className="results-stay-list">
                <div className="stays-horizontal-scroll" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
                    {Array.from({ length: itemsCount }).map((_, idx) => (
                        <div key={idx} className="stay-card">
                            <Skeleton height={180} borderRadius={12} />
                            <Skeleton width="60%" height={20} style={{ marginTop: 12 }} />
                            <Skeleton width="40%" height={16} style={{ marginTop: 8 }} />
                            <Skeleton width="30%" height={16} style={{ marginTop: 8 }} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="map-container">
                <Skeleton height="100%" borderRadius='1rem' />
            </div>
        </section>
    )
}
