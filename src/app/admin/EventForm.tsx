'use client'

import { useState } from 'react'
import { Event, EventDate, addEvent, updateEvent } from '@/actions/eventActions'

type EventFormProps = {
  eventToEdit: Event | null
  onSuccess: () => void
}

export default function EventForm({ eventToEdit, onSuccess }: EventFormProps) {
  const [name, setName] = useState(eventToEdit?.name || '')
  const [venue, setVenue] = useState(eventToEdit?.venue || '')
  const [poster, setPoster] = useState(eventToEdit?.poster || '')
  const [onlinePrice, setOnlinePrice] = useState(eventToEdit?.onlinePrice?.toString() || '')
  const [dates, setDates] = useState<Partial<EventDate>[]>(
    eventToEdit?.dates || [{ id: `date-${Date.now()}`, date: '', price: 0 }]
  )
  const [isSaving, setIsSaving] = useState(false)

  const handleAddDate = () => {
    setDates([...dates, { id: `date-${Date.now()}-${Math.random()}`, date: '', price: 0 }])
  }

  const handleRemoveDate = (index: number) => {
    const newDates = [...dates]
    newDates.splice(index, 1)
    setDates(newDates)
  }

  const handleDateChange = (index: number, field: keyof EventDate, value: string | number) => {
    const newDates = [...dates]
    newDates[index] = { ...newDates[index], [field]: value }
    setDates(newDates)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // basic validation
    if (!name || !venue || !poster || !onlinePrice || dates.length === 0 || dates.some(d => !d.date || d.price === undefined)) {
      alert("Please fill all required fields and ensure all dates have values.")
      return
    }

    setIsSaving(true)
    
    const eventData = {
      name,
      venue,
      poster,
      onlinePrice: parseInt(onlinePrice),
      dates: dates as EventDate[]
    }

    try {
      if (eventToEdit) {
        await updateEvent(eventToEdit.id, eventData)
      } else {
        await addEvent(eventData)
      }
      onSuccess()
    } catch (error) {
      console.error(error)
      alert("Failed to save event.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="card" style={{ padding: 'var(--spacing-xl)', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>{eventToEdit ? 'Edit Event' : 'Add New Event'}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Event Name *</label>
          <input type="text" className="form-input" required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Raatladi" />
        </div>
        
        <div className="form-group">
          <label className="form-label">Venue *</label>
          <input type="text" className="form-input" required value={venue} onChange={e => setVenue(e.target.value)} placeholder="e.g. XYZ Party Plot, Ahmedabad" />
        </div>

        <div className="form-group">
          <label className="form-label">Poster Image URL *</label>
          <input type="url" className="form-input" required value={poster} onChange={e => setPoster(e.target.value)} placeholder="https://..." />
          {poster && (
            <div style={{ marginTop: '8px' }}>
              <img src={poster} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }} />
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Online Price (₹) *</label>
          <input type="number" className="form-input" required value={onlinePrice} onChange={e => setOnlinePrice(e.target.value)} min="0" />
        </div>

        <div style={{ margin: 'var(--spacing-xl) 0', padding: 'var(--spacing-md)', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
            <h3 style={{ fontSize: '1.125rem' }}>Dates and Prices *</h3>
            <button type="button" onClick={handleAddDate} className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.875rem' }}>+ Add Date</button>
          </div>
          
          {dates.map((dateObj, index) => (
            <div key={dateObj.id || index} style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '16px', alignItems: 'flex-end', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <div style={{ flex: '1 1 200px' }}>
                <label className="form-label" style={{ fontSize: '0.875rem' }}>Date</label>
                <input 
                  type="date" 
                  className="form-input" 
                  required 
                  value={dateObj.date} 
                  onChange={e => handleDateChange(index, 'date', e.target.value)} 
                />
              </div>
              <div style={{ flex: '1 1 150px' }}>
                <label className="form-label" style={{ fontSize: '0.875rem' }}>Aarambh Price (₹)</label>
                <input 
                  type="number" 
                  className="form-input" 
                  required 
                  min="0"
                  value={dateObj.price === 0 && !dateObj.id?.startsWith('date-') ? '' : dateObj.price} 
                  onChange={e => handleDateChange(index, 'price', parseInt(e.target.value) || 0)} 
                />
              </div>
              {dates.length > 1 && (
                <button type="button" onClick={() => handleRemoveDate(index)} style={{ padding: '12px', color: '#b91c1c', border: '1px solid #fca5a5', borderRadius: 'var(--radius-sm)', backgroundColor: '#fee2e2' }}>
                  X
                </button>
              )}
            </div>
          ))}
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'SAVE EVENT'}
        </button>
      </form>
    </div>
  )
}
