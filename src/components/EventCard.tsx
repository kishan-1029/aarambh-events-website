import Link from 'next/link'
import { Event } from '@/actions/eventActions'

export default function EventCard({ event }: { event: Event }) {
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
    <article className="card event-card">
      <div className="event-poster-wrap">
        <img
          src={event.poster}
          alt={event.name}
          className="event-poster-img"
          loading="lazy"
        />
      </div>

      <div className="event-card-body">
        <div className="event-info-row">
          <div className="event-meta">
            <h3 className="event-title">{event.name}</h3>
            <p className="event-venue">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, color: 'var(--brand)' }}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              {event.mapLink?.trim() ? (
                <a
                  href={event.mapLink.trim()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="event-venue-link"
                >
                  {event.venue}
                </a>
              ) : (
                <span>{event.venue}</span>
              )}
            </p>
          </div>

          <div className="event-pricing">
            <span className="price-online">Online: ₹{event.onlinePrice}</span>
            <div className="price-aarambh">
              ₹{lowestPrice} <span className="price-onwards">onwards</span>
            </div>
          </div>
        </div>

        <Link href={`/events/${event.id}`} scroll={true} className="btn btn-primary event-book-btn book-now-btn">
          <span>CHECK AVAILABILITY</span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </Link>
      </div>
    </article>
  )
}
