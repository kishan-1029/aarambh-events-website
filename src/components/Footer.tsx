import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ backgroundColor: 'var(--bg-surface)', borderTop: '1px solid var(--border-color)', padding: 'var(--spacing-xl) 0 var(--spacing-lg)' }}>
      <div className="container">
        <div className="grid footer-grid" style={{ marginBottom: 'var(--spacing-xl)' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-sm)' }}>Aarambh Events</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, maxWidth: '300px' }}>
              Ahmedabad's trusted destination for genuine event passes. A premium, hassle-free booking experience.
            </p>
          </div>
          
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: 'var(--spacing-md)' }}>Quick Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link href="/" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Home</Link>
              <Link href="/#passes" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Passes</Link>
              <Link href="/#contact" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Contact</Link>
            </div>
          </div>
          
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: 'var(--spacing-md)' }}>Contact</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <a href="tel:+918866183931" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>+91 88661 83931 (WhatsApp)</a>
              <a href="tel:+919328448836" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>+91 93284 48836</a>
              <a href="tel:+919925625746" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>+91 99256 25746</a>
              <a href="tel:+916359431859" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>+91 63594 31859</a>
              <a href="mailto:aarambhevents99@gmail.com" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>aarambhevents99@gmail.com</a>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: 'var(--spacing-md)' }}>Social</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <a href="https://www.instagram.com/aarambh_events_co?stkn=ODZrMXRpbTdwMjY0" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                Instagram
              </a>
              <a href="https://chat.whatsapp.com/JXjwbvP8LDU5m8h7hiXT45" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                WhatsApp Community
              </a>
            </div>
          </div>
        </div>
        
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 'var(--spacing-lg)', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
            © {new Date().getFullYear()} Aarambh Events. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
