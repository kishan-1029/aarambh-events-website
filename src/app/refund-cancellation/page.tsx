import type { Metadata } from 'next'
import Link from 'next/link'
import RouteScrollTop from '@/components/RouteScrollTop'

export const metadata: Metadata = {
  title: 'Refund & Cancellation | Aarambh Events',
  description: 'Refund and cancellation policy for event passes booked through Aarambh Events.',
}

export default function RefundCancellationPage() {
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
              <h1 className="legal-title">Refund & Cancellation Policy</h1>
              <p className="legal-subtitle">Aarambh Events · Booking Terms & Policy</p>
            </header>

            <div className="legal-body">
              <p className="legal-section-text">
                Booking cancellation and refund eligibility may vary depending on the event and the applicable supplier/organizer conditions.
              </p>

              <p className="legal-section-text">
                Before payment, customers will be informed of the applicable cancellation and refund conditions wherever relevant.
              </p>

              <p className="legal-section-text">
                If an event is officially cancelled, Aarambh Events will communicate the available refund or resolution process to affected customers based on the applicable supplier and organizer terms.
              </p>

              <p className="legal-section-text">
                If an event is postponed or rescheduled, the validity or refund of the pass will depend on the conditions announced for that event.
              </p>

              <p className="legal-section-text">
                No refund will normally be available for customer-side issues such as non-attendance, late arrival or failure to comply with venue or entry requirements, unless otherwise agreed.
              </p>

              <p className="legal-section-text">
                For refund-related queries, customers may contact Aarambh Events using the contact details published on this website.
              </p>
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
