'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Event, EventCategory, EventDate } from '@/actions/eventActions'
import RouteScrollTop from '@/components/RouteScrollTop'

export default function MobileBookingClient({
  event,
  selectedDate,
}: {
  event: Event
  selectedDate: EventDate
}) {
  const router = useRouter()

  const hasCategories = (event.categoryCount ?? 1) > 1 && Boolean(event.categories && event.categories.length > 0)
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | null>(null)

  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [refId, setRefId] = useState('')

  // Format date nicely e.g. "Sunday, 11 October 2026"
  const formatFullDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString('en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    } catch {
      return dateStr
    }
  }

  const formattedDate = formatFullDate(selectedDate.date)

  const currentPrice: string | number | null = hasCategories
    ? (selectedCategory ? (selectedCategory.dates.find(d => d.date === selectedDate.date)?.price ?? selectedDate.price) : null)
    : selectedDate.price

  const totalAmount = currentPrice !== null ? Number(currentPrice) * quantity : null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const trimmedName = name.trim()
    const digitsOnly = mobile.replace(/\D/g, '')
    const trimmedRefId = refId.trim()

    if (!trimmedName) {
      alert('Please enter your full name.')
      return
    }

    if (digitsOnly.length !== 10) {
      alert('Please enter a valid 10-digit mobile number.')
      return
    }

    if (hasCategories && !selectedCategory) {
      alert('Please select a pass category.')
      return
    }

    if (!trimmedRefId) {
      alert('Please enter a Ref ID or enter NA if you do not have one.')
      return
    }

    const categoryLine = hasCategories && selectedCategory
      ? `\nPass Category: ${selectedCategory.name}`
      : ''

    // Message constructed with dynamic validated data
    const message = `Hello Aarambh Events,

I want to book passes.

Event: ${event.name}${categoryLine}
Name: ${trimmedName}
Mobile: ${digitsOnly}
Date: ${formattedDate}
Quantity: ${quantity}
Price Per Pass: ₹${currentPrice}
Total Amount: ₹${totalAmount}
Ref ID: ${trimmedRefId}`

    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/918866183931?text=${encodedMessage}`

    // 1. Open WhatsApp
    window.open(whatsappUrl, '_blank')

    // 2. Clear all state
    setName('')
    setMobile('')
    setQuantity(1)
    setRefId('')
    setSelectedCategory(null)

    // 3. Navigate back to Home
    router.push('/')
  }

  return (
    <main className="mobile-booking-page">
      <RouteScrollTop />
      <div className="container mobile-booking-container">
        {/* Top Navigation */}
        <div className="mobile-booking-nav">
          <Link href={`/events/${event.id}`} scroll={true} className="mobile-back-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span>Back</span>
          </Link>
          <h1 className="mobile-booking-title">Book Passes</h1>
          <div style={{ width: '40px' }} />
        </div>

        {/* Card Form */}
        <div className="mobile-booking-card">
          {/* Event and Date Summary */}
          <div className="mobile-event-summary">
            <h2 className="mobile-event-name">{event.name}</h2>
            <div className="mobile-event-meta-row">
              <div className="mobile-date-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span>{formattedDate}</span>
              </div>
              <div className="mobile-price-badge">
                Price Per Pass: <span className="mobile-price-highlight">{currentPrice !== null ? `₹${currentPrice}` : '—'}</span>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="form-group mb-md">
              <label className="form-label compact-label">
                Full Name <span className="req-star">*</span>
              </label>
              <input
                type="text"
                className="form-input compact-input"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter your full name"
                autoComplete="name"
              />
            </div>

            {/* Mobile Number */}
            <div className="form-group mb-md">
              <label className="form-label compact-label">
                Mobile Number <span className="req-star">*</span>
              </label>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                pattern="[0-9]{10}"
                className="form-input compact-input"
                required
                value={mobile}
                onChange={e => {
                  const digits = e.target.value.replace(/\D/g, '').slice(0, 10)
                  setMobile(digits)
                }}
                placeholder="10-digit mobile number"
                autoComplete="tel"
              />
            </div>

            {/* Selected Date - Locked Read-only */}
            <div className="form-group mb-md">
              <label className="form-label compact-label">
                Selected Date <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 400 }}>(Tap Back to change date)</span>
              </label>
              <input
                type="text"
                className="form-input compact-input date-readonly"
                disabled
                readOnly
                value={formattedDate}
              />
            </div>

            {/* Pass Category (Directly below Selected Date) */}
            {hasCategories && event.categories && (
              <div className="form-group mb-md">
                <label className="form-label compact-label">
                  Choose Pass Category <span className="req-star">*</span>
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
                  {event.categories.map(cat => {
                    const catDateEntry = cat.dates.find(d => d.date === selectedDate.date)
                    const catPrice = catDateEntry?.price || '0'
                    const isCatSelected = selectedCategory?.id === cat.id

                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '10px 14px',
                          borderRadius: 'var(--radius-sm, 6px)',
                          border: isCatSelected ? '2px solid var(--brand)' : '1px solid var(--border)',
                          backgroundColor: isCatSelected ? '#FEF2F2' : 'var(--surface)',
                          color: isCatSelected ? 'var(--brand)' : 'var(--text)',
                          cursor: 'pointer',
                          fontWeight: isCatSelected ? 700 : 500,
                          transition: 'all 0.15s ease',
                          boxShadow: isCatSelected ? '0 0 0 1px var(--brand)' : 'none',
                        }}
                      >
                        <span style={{ fontSize: '0.9rem' }}>{cat.name}</span>
                        <span style={{ fontWeight: 700, color: 'var(--brand)', fontSize: '0.95rem' }}>₹{catPrice}</span>
                      </button>
                    )
                  })}
                </div>
                {!selectedCategory && (
                  <span style={{ fontSize: '0.75rem', color: '#B91C1C', marginTop: '4px', display: 'block', fontWeight: 600 }}>
                    Please select a pass category
                  </span>
                )}
              </div>
            )}

            {/* Quantity */}
            <div className="form-group mb-md">
              <label className="form-label compact-label">Quantity</label>
              <div className="quantity-control-row">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="qty-btn"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="qty-val">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(50, quantity + 1))}
                  className="qty-btn"
                  aria-label="Increase quantity"
                >
                  +
                </button>
                <span className="qty-hint">pass{quantity > 1 ? 'es' : ''}</span>
              </div>
            </div>

            {/* Ref ID */}
            <div className="form-group mb-md ref-id-group">
              <label className="form-label compact-label">
                Ref ID / Ref Number <span className="req-star">*</span>
              </label>
              <input
                type="text"
                className="form-input compact-input"
                value={refId}
                onChange={e => setRefId(e.target.value)}
                placeholder="Enter Ref ID or NA"
                required
              />
              <p className="ref-helper-text">
                Don&apos;t have a Ref ID? Enter <strong>NA</strong>
              </p>
            </div>

            {/* Live Total Banner */}
            <div className="mobile-booking-total-banner">
              <div>
                <span className="modal-calc-text">
                  {currentPrice !== null ? `₹${currentPrice} × ${quantity}` : 'Choose Pass Category'}
                </span>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Total Amount
                </div>
              </div>
              <div className="modal-total-amt" style={{ fontSize: '1.4rem' }}>
                {totalAmount !== null ? `₹${totalAmount.toLocaleString('en-IN')}` : '—'}
              </div>
            </div>

            {/* Confirm Booking Button */}
            <button
              type="submit"
              className="mobile-confirm-btn"
              disabled={hasCategories && !selectedCategory}
              style={{ opacity: hasCategories && !selectedCategory ? 0.6 : 1 }}
            >
              <span>CONFIRM BOOKING</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
