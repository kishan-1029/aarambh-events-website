'use client'

import { useState, useEffect, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { Event, EventDate, EventCategory } from '@/actions/eventActions'

const emptySubscribe = () => () => {}

export default function BookingForm({ event }: { event: Event }) {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState<EventDate | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const isMounted = useSyncExternalStore(emptySubscribe, () => true, () => false)

  // Form State
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [refId, setRefId] = useState('')

  const hasCategories = Boolean(event.categoryCount && event.categoryCount > 1 && event.categories && event.categories.length > 0)
  const displayDates = hasCategories && event.categories
    ? event.categories[0].dates
    : (event.dates || [])

  // Body scroll lock effect
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = 'unset'
      }
    }
  }, [isModalOpen])

  const handleDateSelect = (date: EventDate) => {
    // Mobile responsive rule: on mobile (<= 639px), navigate to dedicated booking page
    if (typeof window !== 'undefined' && window.innerWidth <= 639) {
      router.push(`/events/${event.id}/book?date=${encodeURIComponent(date.date)}`, { scroll: true })
      return
    }
    // Desktop: open modal, reset selected category
    setSelectedCategory(null)
    setSelectedDate(date)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedCategory(null)
  }

  const formatDisplayDate = (dateStr: string) => {
    const d = new Date(dateStr)
    const day = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()
    const num = d.getDate()
    const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
    return { day, num, month, full: d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) }
  }

  // Active price per pass based on selected date & category
  const selectedCatDate = (hasCategories && selectedCategory && selectedDate)
    ? selectedCategory.dates.find(d => d.date === selectedDate.date)
    : null
  const pricePerPass = hasCategories
    ? (selectedCatDate ? Number(selectedCatDate.price) : null)
    : (selectedDate ? Number(selectedDate.price) : null)
  const total = pricePerPass !== null ? pricePerPass * quantity : null

  const submitBooking = (e: React.FormEvent) => {
    e.preventDefault()

    const trimmedRefId = refId.trim()
    const trimmedName = name.trim()
    const digitsOnly = mobile.replace(/\D/g, '')

    if (!selectedDate || !trimmedName || !digitsOnly || !trimmedRefId) {
      alert("Please fill all required fields, including Ref ID (or enter NA).")
      return
    }

    if (hasCategories && !selectedCategory) {
      alert("Please select a pass category.")
      return
    }

    // Strict validation: exactly 10 digits
    if (digitsOnly.length !== 10) {
      alert("Please enter a valid 10-digit mobile number.")
      return
    }

    const formattedDate = formatDisplayDate(selectedDate.date).full

    // WhatsApp Booking Message
    const message = `Hello Aarambh Events,

I want to book passes.

Event: ${event.name}${hasCategories && selectedCategory ? `\nPass Category: ${selectedCategory.name}` : ''}
Name: ${trimmedName}
Mobile: ${digitsOnly}
Date: ${formattedDate}
Quantity: ${quantity}
Price Per Pass: ₹${pricePerPass}
Total Amount: ₹${total}
Ref ID: ${trimmedRefId}`

    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/918866183931?text=${encodedMessage}`

    // 1. Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank')

    // 2. Reset form state
    setName('')
    setMobile('')
    setQuantity(1)
    setRefId('')
    setSelectedCategory(null)
    setSelectedDate(null)

    // 3. Close modal & restore body scroll
    setIsModalOpen(false)
    document.body.style.overflow = 'unset'

    // 4. Return to home page
    router.push('/')
  }

  return (
    <div className="booking-form-container">
      {/* Date Selection Header */}
      <div className="date-selection-header">
        <h2 className="date-section-title">Select Event Date</h2>
        <span className="date-count-badge">{displayDates.length} Dates Available</span>
      </div>

      {/* Date Cards Grid */}
      <div className="date-cards-grid">
        {displayDates.map(d => {
          const dateObj = formatDisplayDate(d.date)
          const isSelected = selectedDate
            ? selectedDate.id && d.id
              ? selectedDate.id === d.id
              : selectedDate.date === d.date
            : false

          let cardPrice = d.price
          if (hasCategories && event.categories) {
            const catPrices = event.categories
              .map(c => {
                const match = c.dates.find(cd => cd.date === d.date)
                return match ? Number(match.price) : NaN
              })
              .filter(p => !isNaN(p) && p > 0)
            if (catPrices.length > 0) {
              cardPrice = Math.min(...catPrices).toString()
            }
          }

          return (
            <button
              key={d.id || d.date}
              type="button"
              onClick={() => handleDateSelect(d)}
              className={`date-card-btn ${isSelected ? 'selected' : ''}`}
            >
              <span className="date-day">{dateObj.day}</span>
              <span className="date-num">{dateObj.num}</span>
              <span className="date-month">{dateObj.month}</span>
              <div className="date-price-tag">
                {hasCategories ? (
                  <>
                    <span className="date-price-prefix" style={{ fontSize: '0.72rem', fontWeight: 600, marginRight: '2px' }}>
                      From{' '}
                    </span>
                    <span className="date-price-currency">₹</span>
                    <span className="date-price-amount">{cardPrice}</span>
                  </>
                ) : (
                  <>
                    <span className="date-price-currency">₹</span>
                    <span className="date-price-amount">{cardPrice}</span>
                  </>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Booking Modal & Bottom Sheet - Rendered directly to document.body via Portal */}
      {isMounted && isModalOpen && selectedDate && createPortal(
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            {/* Compact Header */}
            <div className="modal-header">
              <div className="modal-title-wrap">
                <h3 className="modal-title">Book Passes</h3>
                <span className="modal-event-name">{event.name}</span>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="modal-close-btn"
                aria-label="Close modal"
              >
                &times;
              </button>
            </div>

            {/* Flex Form Container */}
            <form onSubmit={submitBooking} className="modal-form-wrap">
              {/* Internally Scrollable Body */}
              <div className="modal-body">
                <div className="form-group compact-group">
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
                    autoFocus
                  />
                </div>

                <div className="form-group compact-group">
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
                  />
                </div>

                <div className="form-group compact-group">
                  <label className="form-label compact-label">Selected Date</label>
                  <input
                    type="text"
                    className="form-input compact-input date-readonly"
                    disabled
                    value={formatDisplayDate(selectedDate.date).full}
                  />
                </div>

                {/* 14. Pass Category (Only when categoryCount > 1, directly below Selected Date) */}
                {hasCategories && event.categories && selectedDate && (
                  <div className="form-group compact-group">
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

                <div className="form-group compact-group">
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

                {/* 15. Ref ID Field - REQUIRED, No autofill NA */}
                <div className="form-group compact-group ref-id-group">
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
              </div>

              {/* Sticky / Pinned Footer - ALWAYS Visible at 100% zoom */}
              <div className="modal-footer">
                <div className="modal-total-bar">
                  <span className="modal-calc-text">
                    {pricePerPass !== null ? `₹${pricePerPass} × ${quantity}` : 'Choose Pass Category'}
                  </span>
                  <div className="modal-total-text">
                    Total: <span className="modal-total-amt">{total !== null ? `₹${total.toLocaleString('en-IN')}` : '—'}</span>
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary modal-confirm-btn"
                  disabled={hasCategories && !selectedCategory}
                  style={{ opacity: hasCategories && !selectedCategory ? 0.6 : 1 }}
                >
                  <span>CONFIRM BOOKING</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
