import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import SecurityIcon from '@mui/icons-material/Security'
import StarIcon from '@mui/icons-material/Star'
import AddIcon from '@mui/icons-material/Add'
import { loadStays, removeStay } from '../store/actions/stay.actions'
import { StayPreview } from '../cmps/StayPreview'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import '../assets/styles/pages/Dashboard.css'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

export function Dashboard() {
    const user = useSelector(storeState => storeState.userModule.user)
    const stays = useSelector(storeState => storeState.stayModule.stays)
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('about')

    useEffect(() => {
        if (!user) navigate('/')
    }, [user, navigate])

    useEffect(() => {
        loadStays()
    }, [])

    async function onRemoveStay(stayId) {
        if (!window.confirm('Are you sure you want to delete this listing?')) return

        try {
            await removeStay(stayId)
            showSuccessMsg('Listing removed successfully')
        } catch (err) {
            console.error('Failed to remove listing:', err)
            showErrorMsg('Failed to remove listing')
        }
    }

    if (!user) return <div>Loading...</div>

    // Filter stays by current user's host ID
    const userStays = stays.filter(stay => stay.host?._id === user._id)

    const tabs = [
        { id: 'about', label: 'About me', icon: null },
        { id: 'trips', label: 'My Trips', icon: null },
        { id: 'listings', label: 'My Listings', icon: null },
        { id: 'reservations', label: 'Reservations', icon: null },
        { id: 'stats', label: 'Statistics', icon: null },
    ]

    return (
        <div className="dashboard-page main-container">
            <h1 className="dashboard-title">Profile</h1>
            
            <div className="dashboard-container">
                <aside className="dashboard-sidebar">
                    <div className="sidebar-card profile-card">
                        <div className="profile-image-container">
                            {user.imgUrl ? (
                                <img src={user.imgUrl} alt={user.fullname} className="profile-image" />
                            ) : (
                                <div className="profile-placeholder">{user.fullname[0]}</div>
                            )}
                            <div className="badge-icon">
                                <SecurityIcon />
                            </div>
                        </div>
                        <h2 className="profile-name">{user.fullname}</h2>
                        <p className="profile-status">Guest</p>
                    </div>

                    <nav className="dashboard-nav">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </aside>

                <main className="dashboard-content">
                    {activeTab === 'about' && (
                        <div className="about-section">
                            <div className="section-header">
                                <h2>About me</h2>
                                <button className="btn-edit">Edit</button>
                            </div>
                            
                            <div className="identity-verification">
                                <SecurityIcon className="icon" />
                                <span>Identity verified</span>
                            </div>

                            <div className="reviews-written">
                                <div className="icon-container">
                                    <StarIcon />
                                </div>
                                <span>0 Reviews I've written</span>
                            </div>
                        </div>
                    )}

                    {activeTab === 'trips' && (
                        <div className="trips-section">
                            <h2>My Trips</h2>
                            <p>No trips booked... yet!</p>
                        </div>
                    )}

                    {activeTab === 'listings' && (
                        <div className="listings-section">
                            <div className="section-header">
                                <h2>My Listings</h2>
                                <button 
                                    className="btn-add-listing"
                                    onClick={() => navigate('/dashboard/add-listing')}
                                    title="Add new listing"
                                >
                                    <AddIcon />
                                </button>
                            </div>
                            
                            {userStays.length === 0 ? (
                                <p className="empty-listings">No listings yet. Click the + button to add your first listing!</p>
                            ) : (
                                <div className="listings-grid">
                                    {userStays.map(stay => (
                                        <div key={stay._id} className="listing-card">
                                            <StayPreview stay={stay} />
                                            <div className="listing-actions">
                                                <button 
                                                    className="btn-action btn-edit"
                                                    onClick={() => navigate(`/dashboard/edit-listing/${stay._id}`)}
                                                    title="Edit listing"
                                                >
                                                    <EditIcon />
                                                </button>
                                                <button 
                                                    className="btn-action btn-delete"
                                                    onClick={() => onRemoveStay(stay._id)}
                                                    title="Delete listing"
                                                >
                                                    <DeleteIcon />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'reservations' && (
                        <div className="reservations-section">
                            <h2>Reservations</h2>
                            <p>No reservations yet.</p>
                        </div>
                    )}

                    {activeTab === 'stats' && (
                        <div className="stats-section">
                            <h2>Statistics</h2>
                            <p>Coming soon...</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}
