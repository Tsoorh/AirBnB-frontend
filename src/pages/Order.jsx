import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { orderService } from '../services/order'
import { loadStay } from '../store/actions/stay.actions'
import CreditCardForm from '../cmps/modals/CreditCardForm.jsx'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { LoginSignupModal } from '../cmps/LoginSignupModal.jsx'
import { ChooseDates } from '../cmps/FilterCmps/ChooseDates.jsx'
import { GuestsPicker } from '../cmps/FilterCmps/GuestsPicker.jsx'
import {addOrder} from '../store/actions/order.actions.js'

export function Order() {
    const navigate = useNavigate()
    const {stayId} = useParams()
    const [searchParams, setSearchParams] = useSearchParams()
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
    const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false)
    const [isGuestsModalOpen, setIsGuestsModalOpen] = useState(false)
    const [ isStepOne, setStepOne ] = useState(true)

    // const [card, setCard] = useState({cardNumber: '', expiration: '', cvv: '',zipCode: '', })
    const [order, setOrder] = useState(null)
    const stay = useSelector(storeState => storeState.stayModule.stay )
    const loggedInUser = useSelector(storeState => storeState.userModule.user)

    // Get from url
    const checkIn = searchParams.get('checkIn') || ''
    const checkOut = searchParams.get('checkOut') || ''
    const adults = Number(searchParams.get('adults')) || 0
    const children = Number(searchParams.get('children')) || 0
    const pets = Number(searchParams.get('pets')) || 0
    const infants = Number(searchParams.get('infants')) || 0

    const formatDateRange = (checkInDate, checkOutDate) => {
        if (!checkInDate || !checkOutDate) return ''
        const dateIn = new Date(checkInDate)
        const dateOut = new Date(checkOutDate)
        const monthNameIn = dateIn.toLocaleString('en-US', { month: 'short' })
        const monthNameOut = dateOut.toLocaleString('en-US', { month: 'short' })
        const dayIn = dateIn.getDate()
        const dayOut = dateOut.getDate()
        const year = dateIn.getFullYear()

        if (monthNameIn === monthNameOut) {
            return `${monthNameIn} ${dayIn}-${dayOut}, ${year}`
        } else {
            return `${monthNameIn} ${dayIn} - ${monthNameOut} ${dayOut}, ${year}`
        }
    }

    // Handle date change from calendar modal
    const handleDateChange = (field, value) => {
        const newParams = new URLSearchParams(searchParams)
        newParams.set(field, value)
        setSearchParams(newParams)
    }

    // Handle guest change from guests modal
    const handleGuestChange = (guestCounts) => {
        const newParams = new URLSearchParams(searchParams)
        newParams.set('adults', guestCounts.adults || 0)
        newParams.set('children', guestCounts.children || 0)
        newParams.set('infants', guestCounts.infants || 0)
        newParams.set('pets', guestCounts.pets || 0)
        setSearchParams(newParams)
    }


    useEffect(() => {
        if (stayId) {
        loadStay(stayId)
        }
    }, [stayId])


    useEffect(() => {
        if(stay && checkIn && checkOut) {
            const nights = calculateNights(checkIn, checkOut)
            const pricePerNight = Number(stay.price?.base) || 0
            const subtotal = nights * pricePerNight
            const serviceFee = subtotal * 0.14 // 14% service fee
            const cleaningFee = Number(stay.price?.cleaning) || 0
            const totalPrice = subtotal + serviceFee + cleaningFee

            const newOrder = {
                ...orderService.getEmptyOrder(),
                host: {
                    _id: stay.host?._id ||'',
                    fullname: stay.host?.fullname || '',
                    imgUrl: stay.host?.imgUrl
                },
                guest: loggedInUser ? {
                    _id: loggedInUser._id,
                    fullname: loggedInUser.fullname
                } : { _id: '', fullname: ''},
                totalPrice,
                checkIn,
                checkOut,
                guests: {
                    adults,
                    children,
                    infants,
                    pets
                },
                stay: {
                    _id: stay._id,
                    name: stay.name,
                    imgUrl: stay.imgUrls?.[0] || ''
                },
                nights,
                priceBreakdown: {
                    pricePerNight,
                    subtotal,
                    serviceFee,
                    cleaningFee,
                    total: totalPrice
                }
            }
            setOrder(newOrder)
        }
    }, [stay, checkIn, checkOut, adults, children, infants, pets, loggedInUser])


    async function addedOrderAfterPayment(){
        const updatedOrder = {
            ...order,
            status: 'pending',
            paymentStatus: "paid",
        }
        setOrder(prevOrder => ({...prevOrder, ...updatedOrder}))
        try {
            await addOrder(updatedOrder)
            showSuccessMsg('Order added waiting for approval')
        } catch(err){
            showErrorMsg('Cannot add order')
            console.log('err:', err);
        }
    }


    function calculateNights(checkInDate, checkOutDate){
        const start = new Date(checkInDate)
        const end = new Date(checkOutDate)
        const diffTime = Math.abs(end - start)
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays
    }

    function handleBack() {
        navigate(-1)
    }

    function openLoginModal(){
        setIsLoginModalOpen(true)
    }

    function closeLoginModal() {
		setIsLoginModalOpen(false)
	}

    function closeCalendarModal() {
        setIsCalendarModalOpen(false)
    }

    async function handleNextStep() {
        try {
            await addedOrderAfterPayment()
            setStepOne(false)
        } catch (err) {
            console.error('Failed to process payment:', err)
        }
    }



    if (!stay || !order) {
        return (
            <section className='order'>
                <div className='order-loading'>Loading...</div>
            </section>
        )
    }

    if(!loggedInUser) {
        return(
            <section className='order'>
                <button onClick={handleBack} className="back-btn">
                    ← 
                </button>
                <div className='order-steps'>
                    <h1>Request to book</h1>
                    <div className='step step-1'>
                        <div>1. Log in or Sign up</div>
                        <button className='order-btn' onClick={openLoginModal}>Continue</button>
                    </div>
                    <div className='step step-2'>2. Add a Payment method</div>
                    <div className='step step-3'>3. Review your request</div>
                </div>
                <div className='order-summary'>
                    <div className='order-stay'>
                        <div>
                            <div className='stay-preview-container'>
                                <div >
                                    <img src={stay.imgUrls?.[0] || '/img/sunflowers.jpg'} alt={stay.name} className='order-stay-img'/>
                                </div>
                                <div>
                                    <div>{`${stay.name}`}</div>
                                    {stay.rating && (
                                        <div className="rating-display">
                                            <span className="rating-stars star-order">★</span>
                                            <span className="rating-number">{stay.rating.avg}</span>
                                            <span className="rating-count">({stay.rating.count} )</span>
                                            {stay.host.isSuperhost && (
                                                <span className="order-is-superhost">Superhost</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>                        
                        </div>
                        <div className='refund-rule'>Cancel within 24 hours for a full refund.</div>                        
                    </div>

                    <div className='order-dates'>
                        <div>
                            <h2>Dates</h2>
                            <p>{formatDateRange(checkIn, checkOut)}</p>
                        </div>
                        <button className='change-btn' onClick={() => setIsCalendarModalOpen(true)}>Change</button>
                    </div>
                    <div className='order-guests'>
                        <div>
                            <h2>Guests</h2>
                            {adults > 0 && (
                                <p>{`${adults} adult${adults > 1 ? 's' : ''}`}</p>
                            )}
                            {children > 0 && (
                                <p>{`${children} ${children > 1 ? 'children' : 'child'}`}</p>
                            )}
                            {infants > 0 && (
                                <p>{`${infants} infant${infants > 1 ? 's' : ''}`}</p>
                            )}
                            {pets > 0 && (
                                <p>{`${pets} pet${pets > 1 ? 's' : ''}`}</p>
                            )}       
                        </div>
                        <button className='change-btn' onClick={() => setIsGuestsModalOpen(true)}>Change</button>
                    </div>
                    <div className='order-price-details'>
                        <h2>Price details</h2>
                        <div>
                            <span>{`₪${order.priceBreakdown.pricePerNight} x ${order.nights} nights `}</span>
                            <span>{`₪${order.priceBreakdown.subtotal.toFixed(2)}`}</span>
                        </div>
                        {/* <div>
                            <span>Cleaning fee </span>
                            <span>{`₪${order.priceBreakdown.cleaningFee.toFixed(2)}`}</span>
                        </div> */}
                        <div>
                            <span>Service fee </span>
                            <span>{`₪${order.priceBreakdown.serviceFee.toFixed(2)}`}</span>
                        </div>
                    </div>
                    <div className='order-total'>
                        <strong>Total</strong>
                        <strong>{`₪${order.priceBreakdown.total.toFixed(2)}`}</strong>
                    </div>
                </div>
                {isLoginModalOpen && (
                    <LoginSignupModal onClose={closeLoginModal} />
                )}

                {isCalendarModalOpen && (
                    <div className="order-modal-overlay" onClick={() => setIsCalendarModalOpen(false)}>
                        <div className="order-modal-content" onClick={(e) => e.stopPropagation()}>
                            <button className="close-modal-btn" onClick={closeCalendarModal}>×</button>

                            <h2>Change dates</h2>
                            <ChooseDates
                                handleChange={handleDateChange}
                                onCloseModal={() => setIsCalendarModalOpen(false)}
                            />
                        </div>
                    </div>
                )} 
                {isGuestsModalOpen && (
                    <div className="order-modal-overlay" onClick={() => setIsGuestsModalOpen(false)}>
                        <div className="order-modal-content" onClick={(e) => e.stopPropagation()}>
                            <button className="close-modal-btn" onClick={() => setIsGuestsModalOpen(false)}>×</button>

                            <h2>Change guests</h2>
                            <GuestsPicker
                                handleChange={handleGuestChange}
                                onCloseModal={() => setIsGuestsModalOpen(false)}
                            />
                        <button className='save-btn' >Save</button>
                        </div>
                    </div>
                )}

            </section>
        )
    }

    else{
        return(
            <section className='order'>
                <button onClick={handleBack} className="back-btn">
                    ← 
                </button>
                <div className='order-steps'>
                    <h1>Confirm and pay</h1>

                    {/* Step 1: Payment */}
                    {isStepOne ? (
                        <div className='step step-1 credit-card'>
                            <p className='payment-step'>1. Add a Payment method</p>
                            <p className='credit-or-debit'>💳 Credit or debit card</p>
                            <CreditCardForm saveOrder={addedOrderAfterPayment}/>
                            <button className='next-btn' onClick={handleNextStep}>Next</button>
                        </div>
                    ) : (
                        <div className='step step-1-closed'>
                            <p className='payment-step'>1. Add a Payment method</p>
                        </div>
                    )}

                    {/* Step 2: Review */}
                    {isStepOne ? (
                        <div className='step step-2'>2. Review your request</div>
                    ) : (
                        <div className='step step-2-expanded'>
                            <p className='review-step'>2. Review your request</p>
                            <div className='order-review-summary'>
                                <div className='review-item'>
                                    <p>Dates:</p>
                                    <span>{formatDateRange(checkIn, checkOut)}</span>
                                </div>
                                <div className='review-item'>
                                    <p>Guests:</p>
                                    <span>{adults + children} guests</span>
                                </div>
                                <div className='review-item'>
                                    <p>Nights:</p>
                                    <span>{order.nights}</span>
                                </div>
                                <div className='review-item'>
                                    <p>Total:</p>
                                    <span>{`₪${order.priceBreakdown.total.toFixed(2)}`}</span>
                                </div>
                                <div className='review-status'>
                                    <p>✓ Payment completed</p>
                                    <p>✓ Order submitted - waiting for host approval</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className='order-summary'>
                    <div className='order-stay'>
                        <div>
                            <div className='stay-preview-container'>
                                <div >
                                    <img src={stay.imgUrls?.[0] || '/img/sunflowers.jpg'} alt={stay.name} className='order-stay-img'/>
                                </div>
                                <div>
                                    <div>{`${stay.name}`}</div>
                                    {stay.rating && (
                                        <div className="rating-display">
                                            <span className="rating-stars star-order">★</span>
                                            <span className="rating-number">{stay.rating.avg}</span>
                                            <span className="rating-count">({stay.rating.count} )</span>
                                            {stay.host.isSuperhost && (
                                                <span className="order-is-superhost">Superhost</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>                        
                        </div>
                        <div className='refund-rule'>Cancel within 24 hours for a full refund.</div>                        
                    </div>

                    <div className='order-dates'>
                        <div>
                            <h2>Dates</h2>
                            <p>{formatDateRange(checkIn, checkOut)}</p>
                        </div>
                        <button className='change-btn' onClick={() => setIsCalendarModalOpen(true)}>Change</button>
                    </div>
                    <div className='order-guests'>
                        <div>
                            <h2>Guests</h2>
                            {adults > 0 && (
                                <p>{`${adults} adult${adults > 1 ? 's' : ''}`}</p>
                            )}
                            {children > 0 && (
                                <p>{`${children} ${children > 1 ? 'children' : 'child'}`}</p>
                            )}
                            {infants > 0 && (
                                <p>{`${infants} infant${infants > 1 ? 's' : ''}`}</p>
                            )}
                            {pets > 0 && (
                                <p>{`${pets} pet${pets > 1 ? 's' : ''}`}</p>
                            )}       
                        </div>
                        <button className='change-btn' onClick={() => setIsGuestsModalOpen(true)}>Change</button>
                    </div>
                    <div className='order-price-details'>
                        <h2>Price details</h2>
                        <div>
                            <span>{`₪${order.priceBreakdown.pricePerNight} x ${order.nights} nights `}</span>
                            <span>{`₪${order.priceBreakdown.subtotal.toFixed(2)}`}</span>
                        </div>
                        <div>
                            <span>Cleaning fee </span>
                            <span>{`₪${order.priceBreakdown.cleaningFee.toFixed(2)}`}</span>
                        </div>
                        <div>
                            <span>Service fee </span>
                            <span>{`₪${order.priceBreakdown.serviceFee.toFixed(2)}`}</span>
                        </div>
                    </div>
                    <div className='order-total'>
                        <strong>Total</strong>
                        <strong>{`₪${order.priceBreakdown.total.toFixed(2)}`}</strong>
                    </div>
                </div>

                {isCalendarModalOpen && (
                    <div className="order-modal-overlay" onClick={() => setIsCalendarModalOpen(false)}>
                        <div className="order-modal-content" onClick={(e) => e.stopPropagation()}>
                            <button className="close-modal-btn" onClick={closeCalendarModal}>×</button>

                            <h2>Change dates</h2>
                            <ChooseDates
                                handleChange={handleDateChange}
                                onCloseModal={() => setIsCalendarModalOpen(false)}
                            />
                        </div>
                    </div>
                )}                
                
                {isGuestsModalOpen && (
                    <div className="order-modal-overlay" onClick={() => setIsGuestsModalOpen(false)}>
                        <div className="order-modal-content" onClick={(e) => e.stopPropagation()}>
                            <button className="close-modal-btn" onClick={() => setIsGuestsModalOpen(false)}>×</button>

                            <h2>Change guests</h2>
                            <GuestsPicker
                                handleChange={handleGuestChange}
                                onCloseModal={() => setIsGuestsModalOpen(false)}
                            />
                        <button className='save-btn' >Save</button>
                        </div>
                    </div>
                )}

            </section>
        )
    }
}