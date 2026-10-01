'use client'

import { useState } from 'react'
import { Event, EventDate } from '@/actions/eventActions'

export default function BookingForm({ event }: { event: Event }) {
  const [selectedDate, setSelectedDate] = useState<EventDate | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Form State
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [refId, setRefId] = useState('')

  const handleDateSelect = (date: EventDate) => {
    setSelectedDate(date)
    setIsModalOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    document.body.style.overflow = 'unset'
  }

  const formatDisplayDate = (dateStr: string) => {
    const d = new Date(dateStr)
    const day = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()
    const num = d.getDate()
    const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
    return { day, num, month, full: d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) }
  }

  const submitBooking = (e: React.FormEvent) => {
    e.preventDefault()
    
    const trimmedRefId = refId.trim()
    if (!selectedDate || !name || !mobile || !trimmedRefId) return
    
    // validation (simple length check for mobile)
    if (mobile.length < 10) {
      alert("Please enter a valid mobile number.")
      return
    }

    const total = selectedDate.price * quantity
    const formattedDate = formatDisplayDate(selectedDate.date).full

    const message = `Hello Aarambh Events,

I want to book passes.

Event: ${event.name}
Name: ${name}
Mobile: ${mobile}
Date: ${formattedDate}
Quantity: ${quantity}
Price Per Pass: ₹${selectedDate.price}
Total Amount: ₹${total}
Ref ID: ${trimmedRefId}`

    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/918866183931?text=${encodedMessage}`
    
    window.open(whatsappUrl, '_blank')
    handleCloseModal()
  }

  return (
    <>
      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-md)' }}>Select Date</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 'var(--spacing-sm)' }}>
          {event.dates.map(d => {
            const dateObj = formatDisplayDate(d.date)
            return (
              <button
                key={d.id}
                onClick={() => handleDateSelect(d)}
                style={{
                  padding: 'var(--spacing-md)',
                  borderRadius: 'var(--radius-md)',
                  border: '2px solid',
                  borderColor: 'var(--border-color)',
                  backgroundColor: 'var(--bg-surface)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  transition: 'all 0.2s',
                  cursor: 'pointer'
                }}
                onMouseOver={e => e.currentTarget.style.borderColor = 'var(--text-primary)'}
                onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
              >
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{dateObj.day}</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>{dateObj.num}</span>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{dateObj.month}</span>
                <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--border-color)', width: '100%', textAlign: 'center' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>₹{d.price}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {isModalOpen && selectedDate && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Book Passes</h3>
              <button onClick={handleCloseModal} style={{ fontSize: '1.5rem', lineHeight: 1 }}>&times;</button>
            </div>
            
            <form onSubmit={submitBooking}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Name *</label>
                  <input type="text" className="form-input" required value={name} onChange={e => setName(e.target.value)} placeholder="Your Full Name" />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Mobile Number *</label>
                  <input type="tel" className="form-input" required value={mobile} onChange={e => setMobile(e.target.value)} placeholder="10-digit mobile number" />
                </div>

                <div className="form-group">
                  <label className="form-label">Selected Date</label>
                  <input type="text" className="form-input" disabled value={formatDisplayDate(selectedDate.date).full} />
                </div>

                <div className="form-group">
                  <label className="form-label">Quantity</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--bg-secondary)', fontSize: '1.25rem' }}>−</button>
                    <span style={{ fontSize: '1.25rem', fontWeight: 600, width: '30px', textAlign: 'center' }}>{quantity}</span>
                    <button type="button" onClick={() => setQuantity(quantity + 1)} style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--bg-secondary)', fontSize: '1.25rem' }}>+</button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Ref ID / Ref Number *</label>
                  <input type="text" className="form-input" value={refId} onChange={e => setRefId(e.target.value)} placeholder="e.g. AR001" required />
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Don't have a Ref ID? Enter NA</p>
                </div>
              </div>
              
              <div className="modal-footer">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>₹{selectedDate.price} × {quantity}</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>Total: ₹{selectedDate.price * quantity}</span>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', fontSize: '1.125rem', padding: '16px' }}>
                  CONFIRM BOOKING
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
