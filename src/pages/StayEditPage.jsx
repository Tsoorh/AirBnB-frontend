import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { loadStays } from '../store/actions/stay.actions'
import { StayEdit } from '../cmps/StayEdit'
import '../assets/styles/pages/StayEditPage.css'

export function StayEditPage() {
    const user = useSelector(storeState => storeState.userModule.user)
    const navigate = useNavigate()

    useEffect(() => {
        if (!user) {
            navigate('/')
        }
    }, [user, navigate])

    if (!user) return <div>Loading...</div>

    const handleSave = (savedStay) => {
        loadStays()
        navigate('/dashboard')
    }

    const handleCancel = () => {
        navigate('/dashboard')
    }

    return (
        <div className="stay-edit-page">
            <StayEdit onSave={handleSave} onCancel={handleCancel} />
        </div>
    )
}

