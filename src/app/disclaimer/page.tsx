import type { Metadata } from 'next'
import Link from 'next/link'
import RouteScrollTop from '@/components/RouteScrollTop'

export const metadata: Metadata = {
  title: 'Disclaimer | Aarambh Events',
  description: 'Legal disclaimer regarding event pass sourcing and facilitation by Aarambh Events.',
}

export default function DisclaimerPage() {
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
              <h1 className="legal-title">Disclaimer</h1>
              <p className="legal-subtitle">Aarambh Events · Operational & Identification Disclaimer</p>
            </header>

            <div className="legal-body">
              <p className="legal-section-text">
                Aarambh Events is an independent pass sourcing, resale and booking facilitation service. Aarambh Events is not the owner, producer or organizer of the events displayed on this website unless expressly stated otherwise.
              </p>

              <p className="legal-section-text">
                Event names, venue names, dates, categories and related information are displayed for identification and informational purposes only.
              </p>

              <p className="legal-section-text">
                Passes may be sourced through independent distributors, suppliers and other legitimate channels. Availability of any pass is subject to confirmation at the time of enquiry or booking.
              </p>

              <p className="legal-section-text">
                Unless expressly stated, the display of an event on Aarambh Events does not imply any official partnership, sponsorship, endorsement or association between Aarambh Events and the respective event organizer.
              </p>

              <p className="legal-section-text">
                Event timings, venue access, entry policies, artist appearances, postponement, cancellation and other event-related decisions remain under the control of the respective event organizer.
              </p>

              <p className="legal-section-text">
                Customers should verify the final event details and booking conditions communicated to them before completing payment.
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
