import { getEventById } from '@/actions/eventActions'
import { notFound } from 'next/navigation'
import BookingForm from './BookingForm'

export default async function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const event = await getEventById(id)
  
  if (!event) {
    notFound()
  }

  return (
    <main className="container section">
      <div className="grid md:grid-cols-2">
        {/* Left: Event Details & Poster */}
        <div>
          <div style={{ position: 'relative', width: '100%', aspectRatio: '4/5', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: 'var(--spacing-md)' }}>
            <img src={event.poster} alt={event.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
        
        {/* Right: Booking Form & Dates */}
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-sm)' }}>{event.name}</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-md)', fontSize: '1.125rem' }}>
            <span role="img" aria-label="location">📍</span> {event.venue}
          </p>
          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <span style={{ textDecoration: 'line-through', color: 'var(--text-tertiary)' }}>Online Price: ₹{event.onlinePrice}</span>
          </div>

          <BookingForm event={event} />
        </div>
      </div>
    </main>
  )
}
