'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header style={{ backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 50 }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
          {/* Logo */}
          <Link href="/" style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.5px' }}>
            Aarambh Events
          </Link>

          {/* Desktop Nav */}
          <nav style={{ display: 'none', gap: '32px', alignItems: 'center' }} className="md-flex">
            <Link href="/" style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>Home</Link>
            <Link href="/#passes" style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>Passes</Link>
            <Link href="/#contact" style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>Contact</Link>
            <Link href="/#passes" className="btn btn-primary">
              Explore Passes
            </Link>
          </nav>

          {/* Mobile Toggle */}
          <button 
            className="md-hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{ padding: '8px' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {isMobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md-hidden" style={{ padding: '16px 0', display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px solid var(--border-color)' }}>
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} style={{ fontWeight: 500 }}>Home</Link>
            <Link href="/#passes" onClick={() => setIsMobileMenuOpen(false)} style={{ fontWeight: 500 }}>Passes</Link>
            <Link href="/#contact" onClick={() => setIsMobileMenuOpen(false)} style={{ fontWeight: 500 }}>Contact</Link>
            <Link href="/#passes" onClick={() => setIsMobileMenuOpen(false)} className="btn btn-primary" style={{ marginTop: '8px', textAlign: 'center' }}>
              Explore Passes
            </Link>
          </div>
        )}
      </div>
      <style jsx>{`
        @media (min-width: 768px) {
          .md-flex { display: flex !important; }
          .md-hidden { display: none !important; }
        }
      `}</style>
    </header>
  )
}
