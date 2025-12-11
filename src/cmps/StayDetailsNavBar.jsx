import React from 'react'

export function StayDetailsNavBar({ sections, visible }) {
    
    function onScrollToSection(ref) {
        if (ref.current) {
            // Offset for the fixed header height (approx 80px)
            const y = ref.current.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    }

    return (
        <div className={`stay-details-navbar ${visible ? 'visible' : ''}`}>
            <div className="navbar-inner">
                <nav className="navbar-links">
                    {sections.map(section => (
                        <button 
                            key={section.id} 
                            onClick={() => onScrollToSection(section.ref)}
                            className="navbar-link"
                        >
                            {section.label}
                        </button>
                    ))}
                </nav>
            </div>
        </div>
    )
}

