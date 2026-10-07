import type { Metadata } from 'next'
import Link from 'next/link'
import RouteScrollTop from '@/components/RouteScrollTop'

export const metadata: Metadata = {
  title: 'Terms & Conditions | Aarambh Events',
  description: 'Terms and conditions governing pass sourcing, bookings, and customer enquiries with Aarambh Events.',
}

export default function TermsPage() {
  return (
    <div className="legal-page-wrapper">
      <RouteScrollTop />
      <div className="container">
        <div className="legal-page-container">
          <div className="legal-back-nav">
            <Link href="/" className="legal-back-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              <span>Back to Home</span>
            </Link>
          </div>

          <article className="legal-card">
            <header className="legal-header">
              <h1 className="legal-title">Terms & Conditions</h1>
              <p className="legal-subtitle">Aarambh Events · Booking & Facilitation Terms</p>
            </header>

            <div className="legal-body">
              <section className="legal-section">
                <h2 className="legal-section-title">Pass Availability</h2>
                <p className="legal-section-text">
                  All passes are subject to availability and final confirmation. An enquiry submitted through the website does not itself guarantee a booking.
                </p>
              </section>

              <section className="legal-section">
                <h2 className="legal-section-title">Booking Confirmation</h2>
                <p className="legal-section-text">
                  A booking will be treated as confirmed only after the customer receives confirmation from Aarambh Events and completes the applicable payment process.
                </p>
              </section>

              <section className="legal-section">
                <h2 className="legal-section-title">Event Information</h2>
                <p className="legal-section-text">
                  Event dates, timings, venues, categories, artist line-ups and entry conditions may be changed by the respective organizer.
                </p>
              </section>

              <section className="legal-section">
                <h2 className="legal-section-title">Third-Party Events</h2>
                <p className="legal-section-text">
                  Aarambh Events is not responsible for operational decisions taken by an event organizer, including changes to event timing, venue, artist line-up or entry regulations.
                </p>
              </section>

              <section className="legal-section">
                <h2 className="legal-section-title">Pass Validity</h2>
                <p className="legal-section-text">
                  Customers must use the pass strictly in accordance with the applicable event and venue conditions. Passes must not be altered, duplicated or misused.
                </p>
              </section>

              <section className="legal-section">
                <h2 className="legal-section-title">Pricing</h2>
                <p className="legal-section-text">
                  Where a price is communicated, the customer will be informed of the final payable amount before payment.
                </p>
              </section>

              <section className="legal-section">
                <h2 className="legal-section-title">Cancellation and Refund</h2>
                <p className="legal-section-text">
                  Refund eligibility for cancelled, postponed or modified events will be governed by the applicable booking conditions and the refund policy communicated at the time of booking.
                </p>
              </section>

              <section className="legal-section">
                <h2 className="legal-section-title">Customer Information</h2>
                <p className="legal-section-text">
                  Customers are responsible for providing correct name, mobile number, date, quantity and other booking information.
                </p>
              </section>
            </div>

            <div className="legal-footer-nav">
              <Link href="/" className="legal-back-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                <span>Back to Home</span>
              </Link>
            </div>
          </article>
        </div>
      </div>
    </div>
  )
}
