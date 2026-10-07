'use client'

import { useState, useEffect, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'

type ModalType = 'terms' | 'refund' | 'privacy' | 'disclaimer' | 'contact' | null

const PHONE_NUMBERS = [
  '+91 93284 48836',
  '+91 99256 25746',
  '+91 88661 83931',
  '+91 63594 31859',
]

const emptySubscribe = () => () => {}

export default function Footer() {
  const [activeModal, setActiveModal] = useState<ModalType>(null)
  const isMounted = useSyncExternalStore(emptySubscribe, () => true, () => false)

  // Body scroll lock effect without resetting page scroll position
  useEffect(() => {
    if (activeModal) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = 'unset'
      }
    }
  }, [activeModal])

  // Escape key close listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveModal(null)
      }
    }
    if (activeModal) {
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [activeModal])

  const closeModal = () => {
    setActiveModal(null)
  }

  return (
    <footer className="footer-compact">
      <div className="container">
        <div className="footer-content">
          <nav className="footer-legal-nav" aria-label="Legal and Information">
            <button
              type="button"
              onClick={() => setActiveModal('terms')}
              className="footer-legal-link"
            >
              Terms & Conditions
            </button>
            <span className="footer-legal-dot" aria-hidden="true">·</span>

            <button
              type="button"
              onClick={() => setActiveModal('refund')}
              className="footer-legal-link"
            >
              Refund & Cancellation
            </button>
            <span className="footer-legal-dot" aria-hidden="true">·</span>

            <button
              type="button"
              onClick={() => setActiveModal('privacy')}
              className="footer-legal-link"
            >
              Privacy Policy
            </button>
            <span className="footer-legal-dot" aria-hidden="true">·</span>

            <button
              type="button"
              onClick={() => setActiveModal('disclaimer')}
              className="footer-legal-link"
            >
              Disclaimer
            </button>
          </nav>

          <div className="footer-bottom-row">
            <p className="copyright-text">
              © 2026 Aarambh Events. All rights reserved.
            </p>

            <div className="footer-social-icons">
              <a
                href="https://www.instagram.com/aarambh_events_co?stkn=ODZrMXRpbTdwMjY0"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Aarambh Events Instagram"
                className="footer-icon-link"
                title="Instagram"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>

              <a
                href="https://chat.whatsapp.com/JXjwbvP8LDU5m8h7hiXT45"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Aarambh Events WhatsApp Community"
                className="footer-icon-link"
                title="WhatsApp Community"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* In-page Modal rendered via Portal to escape parent containers */}
      {isMounted && activeModal && createPortal(
        <div
          className="legal-modal-overlay"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="legal-modal-title"
        >
          <div
            className={`legal-modal-card ${activeModal === 'contact' ? 'contact-modal-compact' : ''}`}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="legal-modal-header">
              <h2 id="legal-modal-title" className="legal-modal-title">
                {activeModal === 'terms' && 'Terms & Conditions'}
                {activeModal === 'refund' && 'Refund & Cancellation Policy'}
                {activeModal === 'privacy' && 'Privacy Policy'}
                {activeModal === 'disclaimer' && 'Disclaimer'}
                {activeModal === 'contact' && 'Contact Aarambh Events'}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="legal-modal-close-btn"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="legal-modal-body">
              {/* 1. Terms & Conditions Content */}
              {activeModal === 'terms' && (
                <>
                  <div>
                    <h3 className="legal-modal-section-title">Pass Availability</h3>
                    <p>
                      All passes are subject to availability and final confirmation. An enquiry submitted through the website does not itself guarantee a booking.
                    </p>
                  </div>

                  <div>
                    <h3 className="legal-modal-section-title">Booking Confirmation</h3>
                    <p>
                      A booking will be treated as confirmed only after the customer receives confirmation from Aarambh Events and completes the applicable payment process.
                    </p>
                  </div>

                  <div>
                    <h3 className="legal-modal-section-title">Event Information</h3>
                    <p>
                      Event dates, timings, venues, categories, artist line-ups and entry conditions may be changed by the respective organizer.
                    </p>
                  </div>

                  <div>
                    <h3 className="legal-modal-section-title">Third-Party Events</h3>
                    <p>
                      Aarambh Events is not responsible for operational decisions taken by an event organizer, including changes to event timing, venue, artist line-up or entry regulations.
                    </p>
                  </div>

                  <div>
                    <h3 className="legal-modal-section-title">Pass Validity</h3>
                    <p>
                      Customers must use the pass strictly in accordance with the applicable event and venue conditions. Passes must not be altered, duplicated or misused.
                    </p>
                  </div>

                  <div>
                    <h3 className="legal-modal-section-title">Pricing</h3>
                    <p>
                      Where a price is communicated, the customer will be informed of the final payable amount before payment.
                    </p>
                  </div>

                  <div>
                    <h3 className="legal-modal-section-title">Cancellation and Refund</h3>
                    <p>
                      Refund eligibility for cancelled, postponed or modified events will be governed by the applicable booking conditions and the refund policy communicated at the time of booking.
                    </p>
                  </div>

                  <div>
                    <h3 className="legal-modal-section-title">Customer Information</h3>
                    <p>
                      Customers are responsible for providing correct name, mobile number, date, quantity and other booking information.
                    </p>
                  </div>
                </>
              )}

              {/* 2. Refund & Cancellation Content */}
              {activeModal === 'refund' && (
                <>
                  <p>
                    Booking cancellation and refund eligibility may vary depending on the event and the applicable supplier/organizer conditions.
                  </p>

                  <p>
                    Before payment, customers will be informed of the applicable cancellation and refund conditions wherever relevant.
                  </p>

                  <p>
                    If an event is officially cancelled, Aarambh Events will communicate the available refund or resolution process to affected customers based on the applicable supplier and organizer terms.
                  </p>

                  <p>
                    If an event is postponed or rescheduled, the validity or refund of the pass will depend on the conditions announced for that event.
                  </p>

                  <p>
                    No refund will normally be available for customer-side issues such as non-attendance, late arrival or failure to comply with venue or entry requirements, unless otherwise agreed.
                  </p>

                  <p>
                    For refund-related queries, customers may contact Aarambh Events using the contact details published on this website.
                  </p>
                </>
              )}

              {/* 3. Privacy Policy Content */}
              {activeModal === 'privacy' && (
                <>
                  <p>
                    Aarambh Events may collect information such as your name, mobile number and booking details solely for responding to enquiries, processing bookings, providing customer support and communicating booking-related updates.
                  </p>

                  <p>
                    We do not request customers to submit unnecessary sensitive personal information through the booking form.
                  </p>

                  <p>
                    Customer information may be shared with relevant suppliers or service providers only where reasonably necessary to complete or support a booking.
                  </p>

                  <p>
                    For privacy-related queries, customers may contact us through the email address displayed on this website.
                  </p>
                </>
              )}

              {/* 4. Disclaimer Content */}
              {activeModal === 'disclaimer' && (
                <>
                  <p>
                    Aarambh Events is an independent pass sourcing, resale and booking facilitation service. Aarambh Events is not the owner, producer or organizer of the events displayed on this website unless expressly stated otherwise.
                  </p>

                  <p>
                    Event names, venue names, dates, categories and related information are displayed for identification and informational purposes only.
                  </p>

                  <p>
                    Passes may be sourced through independent distributors, suppliers and other legitimate channels. Availability of any pass is subject to confirmation at the time of enquiry or booking.
                  </p>

                  <p>
                    Unless expressly stated, the display of an event on Aarambh Events does not imply any official partnership, sponsorship, endorsement or association between Aarambh Events and the respective event organizer.
                  </p>

                  <p>
                    Event timings, venue access, entry policies, artist appearances, postponement, cancellation and other event-related decisions remain under the control of the respective event organizer.
                  </p>

                  <p>
                    Customers should verify the final event details and booking conditions communicated to them before completing payment.
                  </p>
                </>
              )}

              {/* 5. Contact Content */}
              {activeModal === 'contact' && (
                <div className="contact-modal-grid">
                  <div className="contact-modal-section">
                    <span className="contact-modal-label">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                      Call / WhatsApp Direct
                    </span>
                    {PHONE_NUMBERS.map(phone => {
                      const rawDigits = phone.replace(/\D/g, '')
                      return (
                        <div key={phone} className="contact-modal-phone-row">
                          <span className="contact-modal-phone-text">{phone}</span>
                          <div className="contact-modal-phone-actions">
                            <a
                              href={`tel:+${rawDigits}`}
                              className="contact-modal-action-pill contact-modal-action-call"
                              title={`Call ${phone}`}
                            >
                              Call
                            </a>
                            <a
                              href={`https://wa.me/${rawDigits}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="contact-modal-action-pill contact-modal-action-wa"
                              title={`WhatsApp ${phone}`}
                            >
                              WhatsApp
                            </a>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="contact-modal-section">
                    <span className="contact-modal-label">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                      Official Email
                    </span>
                    <a
                      href="mailto:aarambhevents99@gmail.com"
                      className="contact-modal-link-btn"
                    >
                      <span>aarambhevents99@gmail.com</span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--brand)', fontWeight: 600 }}>Send Mail →</span>
                    </a>
                  </div>

                  <div className="contact-modal-section">
                    <span className="contact-modal-label">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="18" cy="5" r="3"></circle>
                        <circle cx="6" cy="12" r="3"></circle>
                        <circle cx="18" cy="19" r="3"></circle>
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                      </svg>
                      Connect Online
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <a
                        href="https://www.instagram.com/aarambh_events_co?stkn=ODZrMXRpbTdwMjY0"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contact-modal-link-btn"
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                          </svg>
                          <span>aarambh_events_co</span>
                        </div>
                        <span style={{ fontSize: '0.78rem', color: 'var(--brand)', fontWeight: 600 }}>Instagram ↗</span>
                      </a>

                      <a
                        href="https://chat.whatsapp.com/JXjwbvP8LDU5m8h7hiXT45"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contact-modal-link-btn"
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                          </svg>
                          <span>WhatsApp Community</span>
                        </div>
                        <span style={{ fontSize: '0.78rem', color: '#1E7E34', fontWeight: 600 }}>Join ↗</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="legal-modal-footer">
              <button
                type="button"
                onClick={closeModal}
                className="legal-modal-btn-close"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </footer>
  )
}
