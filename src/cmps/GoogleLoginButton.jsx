import { useGoogleLogin } from '@react-oauth/google'
import { login } from '../store/actions/user.actions'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import '../assets/styles/cmps/GoogleLoginButton.css'

export function GoogleLoginButton({ onClose }) {

  const handleGoogleLogin = useGoogleLogin({
    flow: 'implicit',
    onSuccess: async (tokenResponse) => {
      try {
        console.log('Google token received:', tokenResponse)

        // Send the access token to your backend
        const credentials = {
          googleToken: tokenResponse.access_token
        }

        const user = await login(credentials)
        console.log('Logged in user:', user)
        showSuccessMsg(`Welcome ${user.fullname}!`)

        // Close modal after successful login
        if (onClose) onClose()

      } catch (err) {
        console.error('Google login failed:', err)
        showErrorMsg('Failed to login with Google')
      }
    },
    onError: (error) => {
      console.error('Google OAuth error:', error)
      showErrorMsg('Google login failed')
    }
  })

  return (
    <button
      onClick={() => handleGoogleLogin()}
      className="google-login-btn"
      type="button"
    >
      <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" fillRule="evenodd">
          <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
          <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.44 15.983 5.485 18 9.003 18z" fill="#34A853"/>
          <path d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707 0-.593.102-1.17.282-1.709V4.958H.957C.347 6.173 0 7.548 0 9c0 1.452.348 2.827.957 4.042l3.007-2.335z" fill="#FBBC05"/>
          <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.428 0 9.003 0 5.485 0 2.44 2.017.96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"/>
        </g>
      </svg>
      <span>Continue with Google</span>
    </button>
  )
}
