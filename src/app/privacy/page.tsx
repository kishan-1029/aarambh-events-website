import type { Metadata } from 'next'
import Link from 'next/link'
import RouteScrollTop from '@/components/RouteScrollTop'

export const metadata: Metadata = {
  title: 'Privacy Policy | Aarambh Events',
  description: 'Privacy Policy for customers and website visitors of Aarambh Events.',
}

export default function PrivacyPage() {
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
              <h1 className="legal-title">Privacy Policy</h1>
              <p className="legal-subtitle">Aarambh Events · Information & Data Handling</p>
            </header>

            <div className="legal-body">
              <p className="legal-section-text">
                Aarambh Events may collect information such as your name, mobile number and booking details solely for responding to enquiries, processing bookings, providing customer support and communicating booking-related updates.
              </p>

              <p className="legal-section-text">
                We do not request customers to submit unnecessary sensitive personal information through the booking form.
              </p>

              <p className="legal-section-text">
                Customer information may be shared with relevant suppliers or service providers only where reasonably necessary to complete or support a booking.
              </p>

              <p className="legal-section-text">
                For privacy-related queries, customers may contact us through the email address displayed on this website.
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
