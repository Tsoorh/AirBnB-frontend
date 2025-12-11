import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import SecurityIcon from '@mui/icons-material/Security'
import StarIcon from '@mui/icons-material/Star'
import AddIcon from '@mui/icons-material/Add'
import { loadStays, removeStay } from '../store/actions/stay.actions'
import { loadOrders, updateOrderStatus } from '../store/actions/order.actions'
import { StayPreview } from '../cmps/StayPreview'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import '../assets/styles/pages/Dashboard.css'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

export function Dashboard() {
    const user = useSelector(storeState => storeState.userModule.user)
    const stays = useSelector(storeState => storeState.stayModule.stays)
    const orders = useSelector(storeState => storeState.orderModule.orders)
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('about')
    const [listingIndex, setListingIndex] = useState(0)
    const [itemsPerPage, setItemsPerPage] = useState(3)

    useEffect(() => {
        function handleResize() {
            if (window.innerWidth < 768) setItemsPerPage(1)
            else if (window.innerWidth < 1060) setItemsPerPage(2)
            else setItemsPerPage(3)
        }

        handleResize() // Init
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        if (!user) navigate('/')
    }, [user, navigate])

    useEffect(() => {
        loadStays()
    }, [])

    useEffect(() => {
        if (activeTab === 'trips' && user) {
            loadOrders({ guestId: user._id })
        } else if (activeTab === 'reservations' && user) {
            loadOrders({ hostId: user._id })
        }
    }, [activeTab, user])

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

    async function onCancelOrder(orderId) {
        if (!window.confirm('Are you sure you want to cancel this order?')) return
        try {
            await updateOrderStatus(orderId, 'canceled')
            showSuccessMsg('Order canceled successfully')
        } catch (err) {
            console.error('Failed to cancel order:', err)
            showErrorMsg('Failed to cancel order')
        }
    }

    async function onApproveOrder(orderId) {
        try {
            await updateOrderStatus(orderId, 'approved')
            showSuccessMsg('Order approved successfully')
        } catch (err) {
            console.error('Failed to approve order:', err)
            showErrorMsg('Failed to approve order')
        }
    }

    async function onRejectOrder(orderId) {
        try {
            await updateOrderStatus(orderId, 'rejected')
            showSuccessMsg('Order rejected successfully')
        } catch (err) {
            console.error('Failed to reject order:', err)
            showErrorMsg('Failed to reject order')
        }
    }

    function onNextListing() {
        setListingIndex(prevIndex => {
            const nextIndex = prevIndex + itemsPerPage
            return nextIndex >= userStays.length ? 0 : nextIndex
        })
    }

    function onPrevListing() {
        setListingIndex(prevIndex => {
            const prev = prevIndex - itemsPerPage
            if (prev < 0) {
                // If we go back past the start, jump to the last "page" of items
                const totalPages = Math.ceil(userStays.length / itemsPerPage)
                return (totalPages - 1) * itemsPerPage
            }
            return prev
        })
    }

    if (!user) return <div>Loading...</div>

    // Filter stays by current user's host ID
    const userStays = stays.filter(stay => stay.host?._id === user._id)

    const tabs = [
        { id: 'about', label: 'About me', icon: null },
        { id: 'trips', label: 'My Trips', icon: null },
        { id: 'listings', label: 'My Listings', icon: null },
        { id: 'reservations', label: 'Reservations', icon: null },
        // { id: 'stats', label: 'Statistics', icon: null },
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
                            {!orders || orders.length === 0 ? (
                                <p>No trips booked... yet!</p>
                            ) : (
                                <div className="trips-table-container">
                                    <table className="trips-table">
                                        <thead>
                                            <tr>
                                                <th>Stay</th>
                                                <th>Host</th>
                                                <th>Dates</th>
                                                <th>Total</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders
                                                .filter(order => order && order.stay)
                                                .map(order => {
                                                    const isFuture = new Date(order.checkIn) > new Date()
                                                    const canCancel = isFuture && order.status !== 'canceled' && order.status !== 'rejected'
                                                    
                                                    return (
                                                <tr key={order._id}>
                                                    <td className="stay-cell">
                                                        <Link to={`/stay/${order.stay._id}`} className="stay-info-link">
                                                            <div className="stay-info">
                                                                <div className="stay-img-container">
                                                                    {order.stay.imgUrls?.[0] || order.stay.imgUrl ? (
                                                                        <img 
                                                                            src={order.stay.imgUrls?.[0] || order.stay.imgUrl} 
                                                                            alt={order.stay.name || 'Stay'} 
                                                                        />
                                                                    ) : (
                                                                        <div className="placeholder-img">No Image</div>
                                                                    )}
                                                                </div>
                                                                <span className="stay-name">{order.stay.name || 'Unknown Stay'}</span>
                                                            </div>
                                                        </Link>
                                                    </td>
                                                    <td className="host-cell">
                                                        <div className="host-info">
                                                            <img 
                                                                src={order.host?.imgUrl || `https://i.pravatar.cc/150?u=${order.host?._id}`} 
                                                                alt={order.host?.fullname || 'Host'} 
                                                                className="host-avatar"
                                                            />
                                                            <span className="host-name">{order.host?.fullname || 'Host'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="dates-cell">
                                                        {new Date(order.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(order.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                    </td>
                                                    <td className="total-cell">
                                                        ${order.totalPrice?.toLocaleString()}
                                                    </td>
                                                    <td className="status-cell">
                                                        <div className={`status-container ${order.status}`}>
                                                            <span className={`status-dot ${order.status}`}></span>
                                                            <span className="status-text">{order.status}</span>
                                                        </div>
                                                    </td>
                                                    <td className="action-cell">
                                                        <button 
                                                            className="btn-cancel"
                                                            onClick={() => onCancelOrder(order._id)}
                                                            disabled={!canCancel}
                                                            title={!isFuture ? "Cannot cancel past orders" : canCancel ? "Cancel this order" : "Order already canceled/rejected"}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </td>
                                                </tr>
                                            )})}
                                        </tbody>
                                    </table>
                                </div>
                            )}
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
                                <div className="listings-carousel-container">
                                    <button className="carousel-btn prev" onClick={onPrevListing} disabled={userStays.length <= itemsPerPage}>
                                        <ArrowBackIosIcon />
                                    </button>
                                    
                                    <div className="listings-carousel">
                                        {userStays.slice(listingIndex, listingIndex + itemsPerPage).map(stay => (
                                            <div key={stay._id} className="listing-card">
                                                <StayPreview stay={stay} showLikeButton={false} />
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

                                    <button className="carousel-btn next" onClick={onNextListing} disabled={userStays.length <= itemsPerPage}>
                                        <ArrowForwardIosIcon />
                                    </button>
                                    
                                    <div className="carousel-dots">
                                        {Array.from({ length: Math.ceil(userStays.length / itemsPerPage) }).map((_, idx) => (
                                            <span 
                                                key={idx} 
                                                className={`dot ${Math.floor(listingIndex / itemsPerPage) === idx ? 'active' : ''}`}
                                                onClick={() => setListingIndex(idx * itemsPerPage)}
                                            ></span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'reservations' && (
                        <div className="reservations-section">
                            <h2>Reservations</h2>
                            {!orders || orders.length === 0 ? (
                                <p>No reservations yet.</p>
                            ) : (
                                <div className="trips-table-container">
                                    <table className="trips-table">
                                        <thead>
                                            <tr>
                                                <th>Guest</th>
                                                <th>Dates</th>
                                                <th>Stay</th>
                                                <th>Guests</th>
                                                <th>Total Payout</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders
                                                .filter(order => order && order.guest)
                                                .sort((a, b) => {
                                                    // Sort: pending first, then approved/rejected, completed last
                                                    const statusOrder = { 'pending': 0, 'approved': 1, 'rejected': 1, 'completed': 2 }
                                                    return (statusOrder[a.status] || 1) - (statusOrder[b.status] || 1)
                                                })
                                                .map(order => (
                                                <tr key={order._id}>
                                                    <td className="host-cell">
                                                        <div className="host-info">
                                                            <img 
                                                                src={order.guest?.imgUrl || `https://i.pravatar.cc/150?u=${order.guest?._id}`} 
                                                                alt={order.guest?.fullname || 'Guest'} 
                                                                className="host-avatar"
                                                            />
                                                            <span className="host-name">{order.guest?.fullname || 'Guest'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="dates-cell">
                                                        {new Date(order.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(order.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                    </td>
                                                    <td className="stay-cell">
                                                        <span className="stay-name">{order.stay?.name || 'Unknown Stay'}</span>
                                                    </td>
                                                    <td className="total-cell">
                                                        {order.guests?.adults + (order.guests?.children || 0)}
                                                    </td>
                                                    <td className="total-cell">
                                                        ${order.totalPrice?.toLocaleString()}
                                                    </td>
                                                    <td className="status-cell">
                                                        <div className={`status-container ${order.status}`}>
                                                            <span className={`status-dot ${order.status}`}></span>
                                                            <span className="status-text">{order.status}</span>
                                                        </div>
                                                    </td>
                                                    <td className="action-cell">
                                                        {order.status === 'pending' && (
                                                            <div className="action-buttons">
                                                                <button 
                                                                    className="btn-approve"
                                                                    onClick={() => onApproveOrder(order._id)}
                                                                >
                                                                    Approve
                                                                </button>
                                                                <button 
                                                                    className="btn-reject"
                                                                    onClick={() => onRejectOrder(order._id)}
                                                                >
                                                                    Reject
                                                                </button>
                                                            </div>
                                                        )}
                                                        {order.status !== 'pending' && (
                                                            <span className="status-text-only">{order.status}</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* {activeTab === 'stats' && (
                        <div className="stats-section">
                            <h2>Statistics</h2>
                            <p>Coming soon...</p>
                        </div>
                    )} */}
                </main>
            </div>
        </div>
    )
}
