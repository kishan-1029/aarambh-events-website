'use client'

import { useState, useSyncExternalStore } from 'react'

interface AdminGateProps {
  children: React.ReactNode
}

const emptySubscribe = () => () => {}

export default function AdminGate({ children }: AdminGateProps) {
  const isMounted = useSyncExternalStore(emptySubscribe, () => true, () => false)
  const [authenticated, setAuthenticated] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        return sessionStorage.getItem('aarambh_admin_authenticated') === 'true'
      } catch {
        return false
      }
    }
    return false
  })
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Login submit logic
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    if (password === 'Kisrus@8893') {
      try {
        sessionStorage.setItem('aarambh_admin_authenticated', 'true')
      } catch {
        // ignore storage errors
      }
      setAuthenticated(true)
      setError('')
    } else {
      setAuthenticated(false)
      setError('Incorrect password. Please try again.')
    }
  }

  // Prevent flash of unauthenticated content before hydration
  if (!isMounted) {
    return (
      <div className="container section" style={{ maxWidth: '420px', padding: '60px 16px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Loading...</p>
      </div>
    )
  }

  // Authenticated state renders dashboard content
  if (authenticated) {
    return <>{children}</>
  }

  // Login view
  return (
    <div className="container section admin-login-section">
      <div className="card admin-login-card">
        <h1 className="admin-login-heading">Admin Login</h1>

        {error && (
          <div className="admin-error-text" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group mb-md">
            <div className="admin-password-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input admin-password-input"
                placeholder="Password"
                value={password}
                onChange={e => {
                  setPassword(e.target.value)
                  if (error) setError('')
                }}
                required
                autoComplete="current-password"
                style={{ minHeight: '44px', fontSize: '1rem' }}
              />
              {/* Show/Hide Password Eye Button */}
              <button
                type="button"
                className="admin-eye-btn"
                onClick={() => setShowPassword(prev => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  /* Eye Off SVG */
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ pointerEvents: 'none' }}>
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="23" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  /* Eye SVG */
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ pointerEvents: 'none' }}>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary admin-login-btn"
            style={{ width: '100%', minHeight: '48px', fontSize: '1rem', fontWeight: 700 }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}
