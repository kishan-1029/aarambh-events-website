import Link from 'next/link'
import { Event } from '@/actions/eventActions'

export default function EventCard({ event }: { event: Event }) {
  // calculate lowest price
  const lowestPrice = Math.min(...event.dates.map(d => d.price))
  
  return (
    <div className="card">
      <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9' }}>
        {/* Using standard img to avoid next/image config for external domains for now */}
        <img 
          src={event.poster} 
          alt={event.name} 
          style={{ objectFit: 'cover', width: '100%', height: '100%' }} 
        />
      </div>
      <div style={{ padding: 'var(--spacing-lg)' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-sm)' }}>{event.name}</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-md)' }}>
          <span role="img" aria-label="location">📍</span> {event.venue}
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--spacing-lg)' }}>
          <div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', textDecoration: 'line-through' }}>
              Online: ₹{event.onlinePrice}
            </p>
            <p style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              ₹{lowestPrice} <span style={{ fontSize: '0.875rem', fontWeight: 400, color: 'var(--text-secondary)' }}>onwards</span>
            </p>
          </div>
        </div>
        
        <Link href={`/events/${event.id}`} className="btn btn-primary" style={{ width: '100%' }}>
          BOOK NOW
        </Link>
      </div>
    </div>
  )
}
