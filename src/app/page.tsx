import { getEvents } from '@/actions/eventActions'
import EventFiltersSection from '@/components/EventFiltersSection'
import ContactPhoneList from '@/components/ContactPhoneList'

export const revalidate = 0; // ensure fresh data

export default async function Home() {
  const events = await getEvents()

  return (
    <div className="home-wrapper">
      {/* 4. Hero Section - Significantly Shorter & Fast-to-Events */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content animate-hero">
            <h1 className="hero-title">
              Ahmedabad&apos;s Trusted Destination for{' '}
              <span className="text-brand">Genuine Event Passes</span>
            </h1>

            <p className="hero-subtitle">
              Discover event passes at competitive prices. A premium, hassle-free booking experience with no hidden charges.
            </p>

            {/* Compact Light Trust Indicators */}
            <div className="trust-grid">
              <div className="trust-item">
                <span className="trust-number">4+ Years</span>
                <span className="trust-label">Experience</span>
              </div>
              <div className="trust-item">
                <span className="trust-number">15,000+</span>
                <span className="trust-label">Happy Customers</span>
              </div>
              <div className="trust-item">
                <span className="trust-number">Direct</span>
                <span className="trust-label">WhatsApp Booking</span>
              </div>
            </div>

            <div className="hero-action">
              <a href="#passes" className="btn btn-primary hero-btn primary-btn">
                <span>View Available Passes</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <polyline points="19 12 12 19 5 12"></polyline>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Available Events Section with Instant Search & Filters */}
      <EventFiltersSection events={events} />

      {/* 8. WhatsApp Community Section - Refined Brand Styling */}
      <section className="community-section">
        <div className="container">
          <div className="community-card">
            <div className="community-content">
              <div className="community-icon-badge">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <div className="community-text">
                <h2 className="community-title">Never Miss an Event</h2>
                <p className="community-desc">
                  Join the Aarambh Events WhatsApp Community for exclusive pass drops, venue announcements, and early access.
                </p>
              </div>
              <div className="community-action">
                <a
                  href="https://chat.whatsapp.com/JXjwbvP8LDU5m8h7hiXT45"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-community"
                >
                  Join Community
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9 & 10. Contact Section & Clean Social Display */}
      <section id="contact" className="contact-section">
        <div className="container">
          <div className="section-header-compact">
            <h2 className="section-title">Contact Aarambh Events</h2>
            <p className="section-subtitle">
              Need help choosing or booking your passes? Connect with our team directly.
            </p>
          </div>

          <div className="contact-grid">
            {/* Phone & WhatsApp Card */}
            <div className="contact-card">
              <div className="contact-icon-bubble">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <h3 className="contact-card-title">Call / WhatsApp</h3>
              <ContactPhoneList />
            </div>

            {/* Email Card */}
            <div className="contact-card">
              <div className="contact-icon-bubble">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <h3 className="contact-card-title">Official Email</h3>
              <div className="contact-links-list">
                <a 
                  href="mailto:aarambhevents99@gmail.com" 
                  className="contact-link email-link"
                  style={{ minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  aarambhevents99@gmail.com
                </a>
                <p className="contact-subtext">Direct inquiries & corporate bookings</p>
              </div>
            </div>

            {/* Clean Social Area with Instagram & WhatsApp Community Icons */}
            <div className="contact-card">
              <div className="contact-icon-bubble">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3"></circle>
                  <circle cx="6" cy="12" r="3"></circle>
                  <circle cx="18" cy="19" r="3"></circle>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                </svg>
              </div>
              <h3 className="contact-card-title">Connect Online</h3>
              <div className="social-badge-grid">
                <a
                  href="https://www.instagram.com/aarambh_events_co?stkn=ODZrMXRpbTdwMjY0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-btn instagram-btn"
                  title="Official Instagram aarambh_events_co"
                  style={{ minHeight: '44px' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                  <span>aarambh_events_co</span>
                </a>

                <a
                  href="https://chat.whatsapp.com/JXjwbvP8LDU5m8h7hiXT45"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-btn whatsapp-btn"
                  title="Join WhatsApp Community"
                  style={{ minHeight: '44px' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span>WhatsApp Community</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Important Booking Information */}
      <section className="important-booking-section">
        <div className="container">
          <div className="important-booking-card">
            <h2 className="important-booking-heading">Important Booking Information</h2>
            <div className="important-booking-text">
              <p>
                Aarambh Events is an independent pass sourcing and booking facilitation service and is not the organizer of the events displayed on this website.
              </p>
              <p>
                Event names, venues, dates and pass categories are displayed solely for identification and customer enquiry purposes. Pass availability is sourced through independent distributors and third-party suppliers and is subject to confirmation at the time of booking.
              </p>
              <p>
                Aarambh Events does not claim any official partnership, sponsorship, endorsement or authorization from an event organizer unless specifically mentioned.
              </p>
              <p>
                Event schedules, venue rules, entry conditions, postponements and cancellations are determined by the respective event organizers. Customers are requested to confirm final availability, category, price and applicable booking conditions before making payment.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
