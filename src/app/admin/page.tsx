'use client'

import { useState, useEffect } from 'react'
import { Event, getEvents, deleteEvent } from '@/actions/eventActions'
import EventForm from './EventForm'

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [events, setEvents] = useState<Event[]>([])
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'admin123') {
      setIsAuthenticated(true)
      loadEvents()
    } else {
      alert('Invalid password (use admin123)')
    }
  }

  const loadEvents = async () => {
    setIsLoading(true)
    const data = await getEvents()
    setEvents(data)
    setIsLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      await deleteEvent(id)
      await loadEvents()
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="container section" style={{ maxWidth: '400px' }}>
        <div className="card" style={{ padding: 'var(--spacing-xl)', textAlign: 'center' }}>
          <h1 style={{ marginBottom: 'var(--spacing-lg)' }}>Admin Login</h1>
          <form onSubmit={handleLogin}>
            <input 
              type="password" 
              className="form-input mb-md" 
              placeholder="Enter Password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Login</button>
          </form>
        </div>
      </div>
    )
  }

  if (isAddingNew || editingEvent) {
    return (
      <div className="container section">
        <button 
          onClick={() => { setIsAddingNew(false); setEditingEvent(null); }} 
          className="btn btn-outline mb-md"
        >
          ← Back to Dashboard
        </button>
        <EventForm 
          eventToEdit={editingEvent} 
          onSuccess={() => { setIsAddingNew(false); setEditingEvent(null); loadEvents(); }} 
        />
      </div>
    )
  }

  return (
    <div className="container section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-xl)' }}>
        <h1>Admin Dashboard</h1>
        <button onClick={() => setIsAddingNew(true)} className="btn btn-primary">
          + Add New Event
        </button>
      </div>

      {isLoading ? (
        <p>Loading events...</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3">
          {events.map(event => (
            <div key={event.id} className="card" style={{ padding: 'var(--spacing-lg)' }}>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <img src={event.poster} alt={event.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                <div>
                  <h3 style={{ fontSize: '1.125rem' }}>{event.name}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{event.dates.length} Dates</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setEditingEvent(event)} className="btn btn-outline" style={{ flex: 1 }}>Edit</button>
                <button onClick={() => handleDelete(event.id)} className="btn" style={{ flex: 1, backgroundColor: '#fee2e2', color: '#b91c1c' }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
