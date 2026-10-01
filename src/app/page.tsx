import { getEvents } from '@/actions/eventActions'
import EventCard from '@/components/EventCard'

export const revalidate = 0; // ensure fresh data

export default async function Home() {
  const events = await getEvents()

  return (
    <main>
      {/* Hero Section */}
      <section className="section" style={{ backgroundColor: 'var(--bg-secondary)', textAlign: 'center' }}>
        <div className="container">
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-1px', marginBottom: 'var(--spacing-md)', fontWeight: 700 }}>
            Ahmedabad's Trusted Destination for Genuine Event Passes
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto var(--spacing-xl)' }}>
            Discover event passes at competitive prices. A premium, hassle-free booking experience with no hidden charges.
          </p>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
            <div style={{ padding: 'var(--spacing-sm) var(--spacing-md)', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-sm)' }}>
              <span style={{ fontWeight: 600, display: 'block', fontSize: '1.25rem' }}>4+ Years</span>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Experience</span>
            </div>
            <div style={{ padding: 'var(--spacing-sm) var(--spacing-md)', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-sm)' }}>
              <span style={{ fontWeight: 600, display: 'block', fontSize: '1.25rem' }}>15,000+</span>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Happy Customers</span>
            </div>
            <div style={{ padding: 'var(--spacing-sm) var(--spacing-md)', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-sm)' }}>
              <span style={{ fontWeight: 600, display: 'block', fontSize: '1.25rem' }}>100%</span>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Genuine Passes</span>
            </div>
          </div>
          
          <a href="#passes" className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.125rem' }}>
            Explore Passes
          </a>
        </div>
      </section>

      {/* Events Section */}
      <section id="passes" className="section">
        <div className="container">
          <div className="text-center mb-xl">
            <h2 style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>Available Events</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Choose from the best events happening in Ahmedabad.</p>
          </div>
          
          {events.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3" style={{ gap: 'var(--spacing-lg)' }}>
              {events.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center" style={{ padding: 'var(--spacing-xxl)', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
              <p style={{ color: 'var(--text-secondary)' }}>No events currently available.</p>
            </div>
          )}
        </div>
      </section>

      {/* WhatsApp Community Section */}
      <section className="section" style={{ backgroundColor: 'var(--bg-secondary)', textAlign: 'center' }}>
        <div className="container">
          <div className="card" style={{ padding: 'var(--spacing-xl)', maxWidth: '800px', margin: '0 auto', borderTop: '4px solid #25D366' }}>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2rem)', marginBottom: 'var(--spacing-sm)' }}>Never Miss an Event</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-lg)', fontSize: '1.125rem' }}>
              Join the Aarambh Events WhatsApp Community for event updates, pass availability and announcements.
            </p>
            <a href="https://chat.whatsapp.com/JXjwbvP8LDU5m8h7hiXT45" target="_blank" rel="noopener noreferrer" className="btn" style={{ backgroundColor: '#25D366', color: '#FFF', fontSize: '1.125rem', padding: '16px 32px' }}>
              Join WhatsApp Community
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section">
        <div className="container">
          <div className="text-center mb-xl">
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', marginBottom: 'var(--spacing-sm)' }}>Contact Aarambh Events</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>Need help choosing or booking your passes? Get in touch with our team.</p>
          </div>
          
          <div className="grid md:grid-cols-3" style={{ gap: 'var(--spacing-lg)' }}>
            <div className="card" style={{ padding: 'var(--spacing-lg)', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-md)' }}>Phone / WhatsApp</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <a href="tel:+919328448836" style={{ fontWeight: 500 }}>+91 93284 48836</a>
                <a href="tel:+919925625746" style={{ fontWeight: 500 }}>+91 99256 25746</a>
                <a href="tel:+918866183931" style={{ fontWeight: 500 }}>+91 88661 83931</a>
                <a href="tel:+916359431859" style={{ fontWeight: 500 }}>+91 63594 31859</a>
              </div>
            </div>
            
            <div className="card" style={{ padding: 'var(--spacing-lg)', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-md)' }}>Email</h3>
              <a href="mailto:aarambhevents99@gmail.com" style={{ fontWeight: 500, wordBreak: 'break-all' }}>aarambhevents99@gmail.com</a>
            </div>
            
            <div className="card" style={{ padding: 'var(--spacing-lg)', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-md)' }}>Instagram</h3>
              <a href="https://www.instagram.com/aarambh_events_co?stkn=ODZrMXRpbTdwMjY0" target="_blank" rel="noopener noreferrer" style={{ fontWeight: 500 }}>
                @aarambh_events_co
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
