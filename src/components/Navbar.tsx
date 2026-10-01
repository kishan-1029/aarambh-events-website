'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLinkClick = (targetHash?: string) => {
    setMenuOpen(false)
    if (typeof window !== 'undefined') {
      if (!targetHash) {
        if (window.location.pathname === '/') {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      } else if (window.location.pathname === '/') {
        const el = document.querySelector(targetHash)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }
  }

  return (
    <div className="navbar-wrapper">
      <header className="navbar-header">
        <div className="container">
          <div className="navbar-inner">
            {/* Logo & Brand Identity */}
            <Link href="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
              <div className="brand-badge">
                <span className="brand-letter">A</span>
              </div>
              <div className="brand-text-wrap">
                <span className="brand-title">Aarambh Events</span>
                <span className="brand-subtitle">AHMEDABAD</span>
              </div>
            </Link>

            {/* Desktop Navigation - Home, Passes, Contact ONLY */}
            <nav className="navbar-desktop-nav">
              <Link href="/" className="nav-link">
                Home
              </Link>
              <Link href="/#passes" className="nav-link">
                Passes
              </Link>
              <Link href="/#contact" className="nav-link">
                Contact
              </Link>
            </nav>

            {/* Mobile Hamburger Toggle: ☰ tap -> menuOpen=true, ✕ tap -> menuOpen=false */}
            <button 
              type="button"
              className="navbar-mobile-toggle"
              onClick={() => setMenuOpen(prev => !prev)}
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                /* Close ✕ Icon */
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ pointerEvents: 'none' }}>
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              ) : (
                /* Hamburger ☰ Icon */
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ pointerEvents: 'none' }}>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu & Overlay */}
      {menuOpen && (
        <>
          {/* Overlay at z-index: 10000, covers entire screen below header, prevents touch propagation */}
          <div 
            className="navbar-mobile-overlay" 
            onClick={() => setMenuOpen(false)} 
            onTouchMove={(e) => e.preventDefault()}
            aria-hidden="true"
          />
          
          {/* Drawer at z-index: 10001, anchored directly below header */}
          <nav 
            className="navbar-mobile-menu"
            aria-label="Mobile Navigation"
          >
            <Link href="/" onClick={() => handleLinkClick()} className="mobile-nav-link">
              Home
            </Link>
            <Link href="/#passes" onClick={() => handleLinkClick('#passes')} className="mobile-nav-link">
              Passes
            </Link>
            <Link href="/#contact" onClick={() => handleLinkClick('#contact')} className="mobile-nav-link">
              Contact
            </Link>
          </nav>
        </>
      )}
    </div>
  )
}
