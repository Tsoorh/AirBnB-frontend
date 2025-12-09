import React from 'react'
import ReactDOM from 'react-dom/client'

import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import { GoogleOAuthProvider } from '@react-oauth/google'

import { store } from './store/store'
import { RootCmp } from './RootCmp'

import './assets/styles/main.css'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
	<Provider store={store}>
		<Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
			<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
				<RootCmp />
			</GoogleOAuthProvider>
		</Router>
	</Provider>
)
