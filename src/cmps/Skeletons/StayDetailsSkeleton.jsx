import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export function StayDetailsSkeleton() {
    return (
        <div style={{ padding: '0 80px', maxWidth: '1900px', margin: '20px auto' }}>
            {/* Title */}
            <Skeleton width="40%" height={32} style={{ marginBottom: 16 }} />

            {/* Image Gallery */}
            <div style={{ marginBottom: 40 }}>
                <Skeleton height={400} borderRadius={12} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 80 }}>
                {/* Left Column - Details */}
                <div>
                    <Skeleton width="60%" height={28} style={{ marginBottom: 16 }} />
                    <Skeleton count={3} height={16} style={{ marginBottom: 8 }} />

                    <div style={{ marginTop: 32, marginBottom: 32 }}>
                        <Skeleton width="30%" height={24} style={{ marginBottom: 12 }} />
                        <Skeleton count={4} height={16} style={{ marginBottom: 8 }} />
                    </div>

                    <div style={{ marginBottom: 32 }}>
                        <Skeleton width="30%" height={24} style={{ marginBottom: 12 }} />
                        <Skeleton count={6} height={16} style={{ marginBottom: 8 }} />
                    </div>
                </div>

                {/* Right Column - Booking Card */}
                <div style={{ position: 'sticky', top: 100 }}>
                    <Skeleton height={400} borderRadius={12} />
                </div>
            </div>
        </div>
    )
}
