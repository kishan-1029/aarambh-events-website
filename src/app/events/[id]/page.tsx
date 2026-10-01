import { getEventById } from '@/actions/eventActions'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import BookingForm from './BookingForm'
import RouteScrollTop from '@/components/RouteScrollTop'

export const revalidate = 0

export default async function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const event = await getEventById(id)

  if (!event) {
    notFound()
  }

  let lowestPrice = event.onlinePrice
  if (event.categoryCount && event.categoryCount > 1 && event.categories && event.categories.length > 0) {
    const allPrices = event.categories.flatMap(c => c.dates.map(d => Number(d.price))).filter(p => !isNaN(p) && p > 0)
    if (allPrices.length > 0) {
      lowestPrice = Math.min(...allPrices)
    }
  } else if (event.dates && event.dates.length > 0) {
    const prices = event.dates.map(d => Number(d.price)).filter(p => !isNaN(p) && p > 0)
    if (prices.length > 0) {
      lowestPrice = Math.min(...prices)
    }
  }

  return (
    <main className="event-detail-page">
      <RouteScrollTop />
      <div className="container">
        {/* Navigation Breadcrumb */}
        <div className="breadcrumb-wrap">
          <Link href="/#passes" scroll={true} className="back-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span>Back to All Events</span>
          </Link>
        </div>

        {/* Balanced Desktop Layout: Left Poster with Venue, Right Event Details */}
        <div className="event-detail-card">
          <div className="event-detail-grid">
            {/* Left: Poster and Venue directly underneath */}
            <div className="poster-col">
              <div className="poster-stage">
                <img
                  src={event.poster}
                  alt={event.name}
                  className="poster-stage-img"
                />
              </div>
              <div className="poster-venue-wrap">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--brand)', flexShrink: 0 }}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>{event.venue}</span>
              </div>
            </div>

            {/* Right: Event Information & Date Selection */}
            <div className="info-col">
              <div className="event-header-info">
                <h1 className="event-main-title">{event.name}</h1>

                {/* Price Summary Banner */}
                <div className="price-summary-banner">
                  <div>
                    <span className="summary-online-label">Online Price</span>
                    <span className="summary-online-val">₹{event.onlinePrice}</span>
                  </div>
                  <div className="summary-divider"></div>
                  <div>
                    <span className="summary-aarambh-label">Aarambh Price</span>
                    <div className="summary-aarambh-val">
                      ₹{lowestPrice} <span className="summary-onwards">onwards</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Date Selection & Booking Form Component */}
              <BookingForm event={event} />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
