'use client'

import { useState, useEffect } from 'react'
import { Event, getEvents, deleteEvent } from '@/actions/eventActions'
import EventForm from './EventForm'
import AdminGate from '@/components/AdminGate'

function AdminDashboardContent() {
  const [events, setEvents] = useState<Event[]>([])
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const loadEvents = async () => {
    setIsLoading(true)
    const data = await getEvents()
    setEvents(data)
    setIsLoading(false)
  }

  useEffect(() => {
    let ignore = false
    getEvents().then(data => {
      if (!ignore) {
        setEvents(data)
        setIsLoading(false)
      }
    })
    return () => {
      ignore = true
    }
  }, [])

  const handleLogout = () => {
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('aarambh_admin_authenticated')
        window.location.reload()
      }
    } catch {
      // ignore
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      await deleteEvent(id)
      await loadEvents()
    }
  }

  if (isAddingNew || editingEvent) {
    return (
      <div className="admin-page">
        <button 
          onClick={() => { setIsAddingNew(false); setEditingEvent(null); }} 
          className="btn btn-outline admin-back-btn mb-md"
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
    <div className="admin-page">
      <div className="admin-top-bar">
        <h1 className="admin-heading">Admin Dashboard</h1>
        <div className="admin-actions-group">
          <button onClick={() => setIsAddingNew(true)} className="btn btn-primary admin-btn-add">
            + Add New Event
          </button>
          <button onClick={handleLogout} className="btn admin-btn-logout">
            Logout
          </button>
        </div>
      </div>

      {isLoading ? (
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>Loading events...</p>
      ) : (
        <div className="admin-events-list">
          {events.map(event => (
            <div key={event.id} className="admin-event-card">
              <div className="admin-event-top">
                <img 
                  src={event.poster} 
                  alt={event.name} 
                  className="admin-event-poster"
                />
                <div className="admin-event-details">
                  <h3 className="admin-event-name">{event.name}</h3>
                  {event.venue && (
                    <p className="admin-event-venue-text">{event.venue}</p>
                  )}
                  <p className="admin-event-dates-count">
                    {(event.categoryCount && event.categoryCount > 1 && event.categories && event.categories.length > 0)
                      ? `${event.categories.length} Categories (${event.categories[0].dates.length} Dates)`
                      : `${event.dates?.length || 0} Dates`}
                  </p>
                </div>
              </div>
              <div className="admin-event-actions">
                <button onClick={() => setEditingEvent(event)} className="admin-btn-edit">
                  Edit
                </button>
                <button onClick={() => handleDelete(event.id)} className="admin-btn-delete">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function AdminPage() {
  return (
    <AdminGate>
      <AdminDashboardContent />
    </AdminGate>
  )
}
