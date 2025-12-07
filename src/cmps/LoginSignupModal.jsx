import { useState } from 'react'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { signup, login } from '../store/actions/user.actions.js'
import { LoginForm } from './LoginForm.jsx'
import { GoogleLoginButton } from './GoogleLoginButton.jsx'


export function LoginSignupModal({ onClose }) {
    const [isSignup, setIsSignUp] = useState(false)

    function onLogin(credentials) {
        isSignup ? _signup(credentials) : _login(credentials)
    }

    async function _login(credentials) {
        try{
            await login(credentials)
            showSuccessMsg('Logged in successfully')
            if (onClose) onClose()
        }catch (err){
            showErrorMsg('Oops try again')
        }
    }

    async function _signup(credentials) {
        try {
            await signup(credentials)
            showSuccessMsg('Signed in successfully')
            if (onClose) onClose()
        }catch (err) {
            showErrorMsg('Oops try again')
        }
    }

    return (
        <div className="login-overlay" onClick={onClose}>
            <div className='login-signup' onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>×</button>
                <h2>{isSignup ? 'Sign up' : 'Log in'}</h2>

                <GoogleLoginButton onClose={onClose} />

                <div className="divider">
                    <span>or</span>
                </div>

                <LoginForm
                    onLogin={onLogin}
                    isSignup={isSignup}
                />

                <div className="btns">
                    <a href="#" onClick={(e) => { e.preventDefault(); setIsSignUp(isSignup => !isSignup) }}>
                        {isSignup ?
                            'Already a member? Login' :
                            'New user? Signup here'
                        }
                    </a>
                </div>
            </div>
        </div>
    )
}