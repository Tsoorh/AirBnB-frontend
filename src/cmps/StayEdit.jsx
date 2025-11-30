import { useState } from 'react'
import { useSelector } from 'react-redux'
import { addStay } from '../store/actions/stay.actions'
import { stayService } from '../services/stay'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { AmenityIcon } from './AmenityIcon'
import '../assets/styles/cmps/StayEdit.css'

const AVAILABLE_AMENITIES = [
    'Wifi', 'AC', 'Kitchen', 'Washer', 'TV', 'Balcony', 'Heating', 'Garden', 
    'Elevator', 'Dedicated workspace', 'Rooftop', 'Beach access', 'Pool', 
    'Gym', 'Free parking', 'BBQ grill', 'Spa access', 'Dryer', 'Wine tasting'
]

const AVAILABLE_LABELS = [
    'Trending', 'Near beach', 'New', 'Popular', 'Luxury', 'Budget-friendly',
    'Pet-friendly', 'Family-friendly', 'Romantic', 'Business', 'Unique'
]

const PROPERTY_TYPES = [
    'Apartment', 'House', 'Villa', 'Condo', 'Studio', 'Loft', 'Cabin', 'Townhouse', 'Bungalow'
]

export function StayEdit({ onSave, onCancel }) {
    const user = useSelector(storeState => storeState.userModule.user)
    const [stay, setStay] = useState(() => {
        const emptyStay = stayService.getEmptyStay()
        return {
            ...emptyStay,
            host: {
                _id: user._id,
                fullname: user.fullname,
                picture: user.imgUrl || '',
                isSuperhost: false
            }
        }
    })

    const [errors, setErrors] = useState({})
    const [currentStep, setCurrentStep] = useState(0)
    const [imageUrlInput, setImageUrlInput] = useState('')
    const [unavailableDates, setUnavailableDates] = useState([{ startDate: '', endDate: '' }])

    const steps = [
        { id: 'basic', title: 'Basic Info', icon: '📝' },
        { id: 'location', title: 'Location', icon: '📍' },
        { id: 'pricing', title: 'Pricing', icon: '💰' },
        { id: 'capacity', title: 'Capacity', icon: '👥' },
        { id: 'images', title: 'Photos', icon: '📸' },
        { id: 'amenities', title: 'Amenities', icon: '✨' },
        { id: 'details', title: 'Details', icon: '⚙️' }
    ]

    const handleChange = (ev) => {
        const { name, value } = ev.target
        setStay(prev => ({ ...prev, [name]: value }))
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const handleNestedChange = (section, field, value) => {
        setStay(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }))
    }

    const handleAddImageUrl = () => {
        const url = imageUrlInput.trim()
        if (!url) return

        // Basic URL validation
        try {
            new URL(url)
            setStay(prev => ({
                ...prev,
                imgUrls: [...(prev.imgUrls || []), url]
            }))
            setImageUrlInput('')
        } catch (err) {
            showErrorMsg('Please enter a valid URL')
        }
    }

    const handleImageUrlKeyPress = (ev) => {
        if (ev.key === 'Enter') {
            ev.preventDefault()
            handleAddImageUrl()
        }
    }

    const removeImage = (index) => {
        setStay(prev => ({
            ...prev,
            imgUrls: prev.imgUrls.filter((_, i) => i !== index)
        }))
    }

    const handleAmenityToggle = (amenity) => {
        setStay(prev => {
            const currentAmenities = prev.amenities || []
            const isSelected = currentAmenities.includes(amenity)
            return {
                ...prev,
                amenities: isSelected
                    ? currentAmenities.filter(a => a !== amenity)
                    : [...currentAmenities, amenity]
            }
        })
    }

    const handleLabelToggle = (label) => {
        setStay(prev => {
            const currentLabels = prev.labels || []
            const isSelected = currentLabels.includes(label)
            return {
                ...prev,
                labels: isSelected
                    ? currentLabels.filter(l => l !== label)
                    : [...currentLabels, label]
            }
        })
    }

    const handleHouseRulesChange = (ev) => {
        const rules = ev.target.value.split(',').map(r => r.trim()).filter(r => r)
        setStay(prev => ({ ...prev, houseRules: rules }))
    }

    const handleUnavailableDateChange = (index, field, value) => {
        const updated = [...unavailableDates]
        updated[index] = { ...updated[index], [field]: value }
        setUnavailableDates(updated)
    }

    const addUnavailableDateRange = () => {
        setUnavailableDates([...unavailableDates, { startDate: '', endDate: '' }])
    }

    const removeUnavailableDateRange = (index) => {
        setUnavailableDates(unavailableDates.filter((_, i) => i !== index))
    }

    const validateStep = (stepIndex) => {
        const newErrors = {}
        const step = steps[stepIndex]

        if (step.id === 'basic') {
            if (!stay.name?.trim()) newErrors.name = 'Property name is required'
            if (!stay.type?.trim()) newErrors.type = 'Property type is required'
            if (!stay.summary?.trim()) newErrors.summary = 'Description is required'
        } else if (step.id === 'location') {
            if (!stay.loc?.city?.trim()) newErrors.city = 'City is required'
            if (!stay.loc?.address?.trim()) newErrors.address = 'Address is required'
            if (!stay.loc?.country?.trim()) newErrors.country = 'Country is required'
            if (!stay.loc?.countryCode?.trim()) newErrors.countryCode = 'Country code is required'
            if (!stay.loc?.lat || !stay.loc?.lng) {
                newErrors.location = 'Latitude and longitude are required'
            }
        } else if (step.id === 'pricing') {
            if (!stay.price?.base || stay.price.base <= 0) newErrors.price = 'Price must be greater than 0'
        } else if (step.id === 'capacity') {
            if (!stay.capacity?.guests || stay.capacity.guests < 1) newErrors.guests = 'Must accommodate at least 1 guest'
        } else if (step.id === 'images') {
            if (!stay.imgUrls?.length) newErrors.imgUrls = 'At least one image is required'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleNext = () => {
        if (validateStep(currentStep)) {
            if (currentStep < steps.length - 1) {
                setCurrentStep(currentStep + 1)
            }
        }
    }

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
        }
    }

    const handleSubmit = async (ev) => {
        ev.preventDefault()
        
        if (!validateStep(currentStep)) {
            return
        }

        // Validate all steps
        for (let i = 0; i < steps.length; i++) {
            if (!validateStep(i)) {
                setCurrentStep(i)
                showErrorMsg('Please complete all required fields')
                return
            }
        }

        // Process unavailable dates
        const processedUnavailable = unavailableDates
            .filter(range => range.startDate && range.endDate)
            .map(range => ({
                startDate: range.startDate,
                endDate: range.endDate
            }))

        const stayToSave = {
            ...stay,
            unavailable: processedUnavailable
        }

        try {
            const savedStay = await addStay(stayToSave)
            showSuccessMsg('Stay added successfully!')
            if (onSave) onSave(savedStay)
        } catch (err) {
            showErrorMsg('Failed to add stay')
            console.error('Error adding stay:', err)
        }
    }

    const renderStepContent = () => {
        const step = steps[currentStep]

        switch (step.id) {
            case 'basic':
                return (
                    <div className="step-content">
                        <h3>Tell us about your place</h3>
                        <div className="form-group">
                            <label htmlFor="name">Property Name *</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={stay.name}
                                onChange={handleChange}
                                placeholder="e.g., Cozy Apartment in Tel Aviv"
                                className={errors.name ? 'error' : ''}
                            />
                            {errors.name && <span className="error-msg">{errors.name}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="type">Property Type *</label>
                            <select
                                id="type"
                                name="type"
                                value={stay.type}
                                onChange={handleChange}
                                className={errors.type ? 'error' : ''}
                            >
                                <option value="">Select property type</option>
                                {PROPERTY_TYPES.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                            {errors.type && <span className="error-msg">{errors.type}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="summary">Description *</label>
                            <textarea
                                id="summary"
                                name="summary"
                                value={stay.summary}
                                onChange={handleChange}
                                placeholder="Describe your property in detail. What makes it special? What can guests expect?"
                                rows="8"
                                className={errors.summary ? 'error' : ''}
                            />
                            {errors.summary && <span className="error-msg">{errors.summary}</span>}
                            <small className="form-hint">A detailed description helps guests understand what makes your place special.</small>
                        </div>
                    </div>
                )

            case 'location':
                return (
                    <div className="step-content">
                        <h3>Where is your place located?</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="country">Country *</label>
                                <input
                                    type="text"
                                    id="country"
                                    value={stay.loc?.country || ''}
                                    onChange={(e) => handleNestedChange('loc', 'country', e.target.value)}
                                    placeholder="e.g., Israel"
                                    className={errors.country ? 'error' : ''}
                                />
                                {errors.country && <span className="error-msg">{errors.country}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="countryCode">Country Code *</label>
                                <input
                                    type="text"
                                    id="countryCode"
                                    value={stay.loc?.countryCode || ''}
                                    onChange={(e) => handleNestedChange('loc', 'countryCode', e.target.value.toUpperCase())}
                                    placeholder="e.g., IL"
                                    maxLength="2"
                                    className={errors.countryCode ? 'error' : ''}
                                />
                                {errors.countryCode && <span className="error-msg">{errors.countryCode}</span>}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="city">City *</label>
                            <input
                                type="text"
                                id="city"
                                value={stay.loc?.city || ''}
                                onChange={(e) => handleNestedChange('loc', 'city', e.target.value)}
                                placeholder="e.g., Tel Aviv-Yafo"
                                className={errors.city ? 'error' : ''}
                            />
                            {errors.city && <span className="error-msg">{errors.city}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="address">Street Address *</label>
                            <input
                                type="text"
                                id="address"
                                value={stay.loc?.address || ''}
                                onChange={(e) => handleNestedChange('loc', 'address', e.target.value)}
                                placeholder="e.g., Rothschild Blvd 15"
                                className={errors.address ? 'error' : ''}
                            />
                            {errors.address && <span className="error-msg">{errors.address}</span>}
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="lat">Latitude *</label>
                                <input
                                    type="number"
                                    id="lat"
                                    step="any"
                                    value={stay.loc?.lat || ''}
                                    onChange={(e) => handleNestedChange('loc', 'lat', parseFloat(e.target.value) || null)}
                                    placeholder="e.g., 32.0853"
                                    className={errors.location ? 'error' : ''}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="lng">Longitude *</label>
                                <input
                                    type="number"
                                    id="lng"
                                    step="any"
                                    value={stay.loc?.lng || ''}
                                    onChange={(e) => handleNestedChange('loc', 'lng', parseFloat(e.target.value) || null)}
                                    placeholder="e.g., 34.7818"
                                    className={errors.location ? 'error' : ''}
                                />
                            </div>
                        </div>
                        {errors.location && <span className="error-msg">{errors.location}</span>}
                        <small className="form-hint">You can find coordinates using Google Maps. Right-click on a location and select coordinates.</small>
                    </div>
                )

            case 'pricing':
                return (
                    <div className="step-content">
                        <h3>Set your pricing</h3>
                        <div className="form-group">
                            <label htmlFor="price">Base Price per Night (ILS) *</label>
                            <input
                                type="number"
                                id="price"
                                min="0"
                                step="1"
                                value={stay.price?.base || ''}
                                onChange={(e) => handleNestedChange('price', 'base', parseInt(e.target.value) || 0)}
                                placeholder="e.g., 450"
                                className={errors.price ? 'error' : ''}
                            />
                            {errors.price && <span className="error-msg">{errors.price}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="cleaningFee">Cleaning Fee (ILS)</label>
                            <input
                                type="number"
                                id="cleaningFee"
                                min="0"
                                step="1"
                                value={stay.price?.cleaningFee || ''}
                                onChange={(e) => handleNestedChange('price', 'cleaningFee', parseInt(e.target.value) || 0)}
                                placeholder="e.g., 80"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="currency">Currency</label>
                            <select
                                id="currency"
                                value={stay.price?.currency || 'ILS'}
                                onChange={(e) => handleNestedChange('price', 'currency', e.target.value)}
                            >
                                <option value="ILS">ILS (₪)</option>
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                            </select>
                        </div>
                    </div>
                )

            case 'capacity':
                return (
                    <div className="step-content">
                        <h3>How many guests can your place accommodate?</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="guests">Guests *</label>
                                <input
                                    type="number"
                                    id="guests"
                                    min="1"
                                    value={stay.capacity?.guests || ''}
                                    onChange={(e) => handleNestedChange('capacity', 'guests', parseInt(e.target.value) || 1)}
                                    className={errors.guests ? 'error' : ''}
                                />
                                {errors.guests && <span className="error-msg">{errors.guests}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="bedrooms">Bedrooms</label>
                                <input
                                    type="number"
                                    id="bedrooms"
                                    min="0"
                                    value={stay.capacity?.bedrooms || ''}
                                    onChange={(e) => handleNestedChange('capacity', 'bedrooms', parseInt(e.target.value) || 0)}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="beds">Beds</label>
                                <input
                                    type="number"
                                    id="beds"
                                    min="0"
                                    value={stay.capacity?.beds || ''}
                                    onChange={(e) => handleNestedChange('capacity', 'beds', parseInt(e.target.value) || 0)}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="bathrooms">Bathrooms</label>
                                <input
                                    type="number"
                                    id="bathrooms"
                                    min="0"
                                    step="0.5"
                                    value={stay.capacity?.bathrooms || ''}
                                    onChange={(e) => handleNestedChange('capacity', 'bathrooms', parseFloat(e.target.value) || 0)}
                                />
                            </div>
                        </div>
                    </div>
                )

            case 'images':
                return (
                    <div className="step-content">
                        <h3>Add photos of your place</h3>
                        <div className="form-group">
                            <label htmlFor="imageUrl">Image URL *</label>
                            <div className="image-url-input-group">
                                <input
                                    type="text"
                                    id="imageUrl"
                                    value={imageUrlInput}
                                    onChange={(e) => setImageUrlInput(e.target.value)}
                                    onKeyPress={handleImageUrlKeyPress}
                                    placeholder="https://example.com/image.jpg"
                                    className="image-url-input"
                                />
                                <button
                                    type="button"
                                    className="btn-add-image"
                                    onClick={handleAddImageUrl}
                                >
                                    Add
                                </button>
                            </div>
                            {errors.imgUrls && <span className="error-msg">{errors.imgUrls}</span>}
                            <small className="form-hint">Enter image URLs one at a time. You can add multiple images.</small>
                        </div>

                        {stay.imgUrls && stay.imgUrls.length > 0 && (
                            <div className="images-preview">
                                <h4>Added Images ({stay.imgUrls.length})</h4>
                                <div className="images-grid">
                                    {stay.imgUrls.map((imgUrl, index) => (
                                        <div key={index} className="image-preview-item">
                                            <img src={imgUrl} alt={`Preview ${index + 1}`} onError={(e) => {
                                                e.target.src = '/img/sunflowers.jpg'
                                            }} />
                                            <button
                                                type="button"
                                                className="remove-image-btn"
                                                onClick={() => removeImage(index)}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )

            case 'amenities':
                return (
                    <div className="step-content">
                        <h3>What amenities does your place offer?</h3>
                        <div className="form-group">
                            <label>Select Amenities</label>
                            <div className="amenities-grid">
                                {AVAILABLE_AMENITIES.map(amenity => {
                                    const isSelected = stay.amenities?.includes(amenity)
                                    return (
                                        <button
                                            key={amenity}
                                            type="button"
                                            className={`amenity-chip ${isSelected ? 'selected' : ''}`}
                                            onClick={() => handleAmenityToggle(amenity)}
                                        >
                                            <span className="amenity-icon">
                                                <AmenityIcon amenity={amenity} />
                                            </span>
                                            <span>{amenity}</span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Property Labels (Optional)</label>
                            <div className="labels-grid">
                                {AVAILABLE_LABELS.map(label => {
                                    const isSelected = stay.labels?.includes(label)
                                    return (
                                        <button
                                            key={label}
                                            type="button"
                                            className={`label-chip ${isSelected ? 'selected' : ''}`}
                                            onClick={() => handleLabelToggle(label)}
                                        >
                                            {label}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )

            case 'details':
                return (
                    <div className="step-content">
                        <h3>Additional Details</h3>
                        <div className="form-group">
                            <label>Check-in & Check-out Times</label>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="checkInFrom">Check-in From</label>
                                    <input
                                        type="time"
                                        id="checkInFrom"
                                        value={stay.checkIn?.from || '15:00'}
                                        onChange={(e) => handleNestedChange('checkIn', 'from', e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="checkInTo">Check-in To</label>
                                    <input
                                        type="time"
                                        id="checkInTo"
                                        value={stay.checkIn?.to || '22:00'}
                                        onChange={(e) => handleNestedChange('checkIn', 'to', e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="checkOutBy">Check-out By</label>
                                    <input
                                        type="time"
                                        id="checkOutBy"
                                        value={stay.checkOut?.by || '11:00'}
                                        onChange={(e) => handleNestedChange('checkOut', 'by', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="houseRules">House Rules (comma-separated)</label>
                            <input
                                type="text"
                                id="houseRules"
                                value={stay.houseRules?.join(', ') || ''}
                                onChange={handleHouseRulesChange}
                                placeholder="e.g., No smoking, No parties, No pets"
                            />
                        </div>

                        <div className="form-group">
                            <label>Unavailable Dates (Optional)</label>
                            <div className="unavailable-dates">
                                {unavailableDates.map((range, index) => (
                                    <div key={index} className="unavailable-date-row">
                                        <input
                                            type="date"
                                            value={range.startDate}
                                            onChange={(e) => handleUnavailableDateChange(index, 'startDate', e.target.value)}
                                        />
                                        <span>to</span>
                                        <input
                                            type="date"
                                            value={range.endDate}
                                            onChange={(e) => handleUnavailableDateChange(index, 'endDate', e.target.value)}
                                        />
                                        {unavailableDates.length > 1 && (
                                            <button
                                                type="button"
                                                className="btn-remove"
                                                onClick={() => removeUnavailableDateRange(index)}
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    className="btn-add-range"
                                    onClick={addUnavailableDateRange}
                                >
                                    + Add Date Range
                                </button>
                            </div>
                        </div>
                    </div>
                )

            default:
                return null
        }
    }

    return (
        <div className="stay-edit-page-content">
            <div className="stay-edit-header">
                <h2>Create a New Listing</h2>
                {onCancel && (
                    <button className="btn-close" onClick={onCancel}>×</button>
                )}
            </div>

                <div className="steps-indicator">
                    {steps.map((step, index) => (
                        <div
                            key={step.id}
                            className={`step-indicator ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
                            onClick={() => {
                                if (index <= currentStep) {
                                    setCurrentStep(index)
                                }
                            }}
                        >
                            <span className="step-number">{index + 1}</span>
                            <span className="step-label">{step.title}</span>
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="stay-edit-form">
                    {renderStepContent()}

                    <div className="form-actions">
                        {currentStep > 0 && (
                            <button type="button" className="btn-secondary" onClick={handlePrevious}>
                                ← Previous
                            </button>
                        )}
                        <div className="actions-right">
                            {currentStep < steps.length - 1 ? (
                                <button type="button" className="btn-primary" onClick={handleNext}>
                                    Next →
                                </button>
                            ) : (
                                <button type="submit" className="btn-submit">
                                    Create Listing
                                </button>
                            )}
                        </div>
                    </div>
                </form>
        </div>
    )
}

