import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export function StayIndexSkeleton({ staysPerRow = 7, rows = 6 }) {
    return (
        <section className="stay-index">
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <div key={rowIndex} style={{ marginTop: '30px', marginBottom: '48px', padding: '0 50px' }}>
                    <div style={{ marginBottom: '16px' }}>
                        <Skeleton width={200} height={30} />
                    </div>
                    <div className="stays-horizontal-scroll">
                        {Array.from({ length: staysPerRow }).map((_, idx) => (
                            <div key={idx} className="stay-card">
                                <Skeleton height={280} borderRadius={12} />
                                <Skeleton width="60%" height={20} style={{ marginTop: 12 }} />
                                <Skeleton width="40%" height={16} style={{ marginTop: 8 }} />
                                <Skeleton width="30%" height={16} style={{ marginTop: 8 }} />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </section>
    )
}
