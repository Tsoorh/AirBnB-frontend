import { useLocation } from 'react-router-dom'
import '../assets/styles/cmps/AppFooter.css'

export function AppFooter() {
	const location = useLocation()

	// Don't show footer on these pages
	if (location.pathname === '/become-host' || location.pathname.includes('/order')) {
		return null
	}

	return (
		<footer className="app-footer full">
			<div className="footer-content">
				<div className="footer-left">
					<p>© 2024 Urbnb Clone</p>
					<span className="separator">·</span>
					<a href="/terms">Terms</a>
					<span className="separator">·</span>
					<a href="/privacy">Privacy</a>
					<span className="separator">·</span>
					<a href="/sitemap">Sitemap</a>
				</div>
				<div className="footer-right">
					<a href="/help" className="footer-link">Help Center</a>
				</div>
			</div>
		</footer>
	)
}