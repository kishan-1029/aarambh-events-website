'use client'

import { useState, useEffect, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'

const PHONE_NUMBERS = [
  '+91 93284 48836',
  '+91 99256 25746',
  '+91 88661 83931',
  '+91 63594 31859',
]

const emptySubscribe = () => () => {}

export default function ContactPhoneList() {
  const [selectedPhone, setSelectedPhone] = useState<string | null>(null)
  const isMounted = useSyncExternalStore(emptySubscribe, () => true, () => false)

  useEffect(() => {
    if (selectedPhone) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = 'unset'
      }
    }
  }, [selectedPhone])

  const handleSelect = (phone: string) => {
    setSelectedPhone(phone)
  }

  const handleClose = () => {
    setSelectedPhone(null)
  }

  // Extract digits only for tel: and https://wa.me/
  const rawDigits = selectedPhone ? selectedPhone.replace(/\D/g, '') : ''

  return (
    <>
      <div className="contact-links-list">
        {PHONE_NUMBERS.map(phone => (
          <button
            key={phone}
            type="button"
            onClick={() => handleSelect(phone)}
            className="contact-link"
            style={{
              textAlign: 'center',
              cursor: 'pointer',
              border: 'none',
              background: 'transparent',
              width: '100%',
              minHeight: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'manipulation',
            }}
            aria-label={`Call or WhatsApp ${phone}`}
          >
            {phone}
          </button>
        ))}
      </div>

      {/* Render Action Sheet in document.body via Portal to escape all parent containers */}
      {isMounted && selectedPhone && createPortal(
        <div 
          className="contact-sheet-overlay" 
          onClick={handleClose}
          style={{ position: 'fixed', inset: 0, zIndex: 20000 }}
        >
          <div 
            className="contact-sheet-card" 
            onClick={e => e.stopPropagation()}
            style={{ position: 'relative', zIndex: 20001 }}
          >
            <div className="contact-sheet-header">
              <p className="contact-sheet-title">Contact Aarambh Events</p>
              <p className="contact-sheet-phone">{selectedPhone}</p>
            </div>

            <div className="contact-sheet-actions">
              {/* Dynamic Call anchor */}
              <a
                href={`tel:+${rawDigits}`}
                className="contact-action-btn contact-action-call"
                onClick={handleClose}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#2E7D32' }}>
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <span>Call</span>
              </a>

              {/* Dynamic WhatsApp anchor */}
              <a
                href={`https://wa.me/${rawDigits}`}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-action-btn contact-action-whatsapp"
                onClick={handleClose}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span>WhatsApp</span>
              </a>

              {/* Cancel Action */}
              <button
                type="button"
                className="contact-action-btn contact-action-cancel"
                onClick={handleClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
