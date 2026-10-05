'use client'

import { useState, useEffect, useCallback } from 'react'
import { Event, getEvents, deleteEvent } from '@/actions/eventActions'
import { getAnalyticsSummary, AnalyticsSummary } from '@/actions/analyticsActions'
import EventForm from './EventForm'
import AdminGate from '@/components/AdminGate'

function formatDayLabel(dateStr: string): string {
  try {
    const [y, m, d] = dateStr.split('-').map(Number)
    const dt = new Date(y, m - 1, d)
    const today = new Date()
    if (
      dt.getFullYear() === today.getFullYear() &&
      dt.getMonth() === today.getMonth() &&
      dt.getDate() === today.getDate()
    ) {
      return 'Today'
    }
    return dt.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })
  } catch {
    return dateStr
  }
}

function AdminDashboardContent() {
  const [events, setEvents] = useState<Event[]>([])
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Analytics states
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null)
  const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(true)
  const [isRefreshingAnalytics, setIsRefreshingAnalytics] = useState(false)

  const loadEvents = async () => {
    setIsLoading(true)
    const data = await getEvents()
    setEvents(data)
    setIsLoading(false)
  }

  const loadAnalytics = useCallback(async (isManual = false) => {
    if (isManual) setIsRefreshingAnalytics(true)
    try {
      const summary = await getAnalyticsSummary()
      setAnalytics(summary)
    } catch (err) {
      console.error('Failed to load analytics summary:', err)
    } finally {
      setIsAnalyticsLoading(false)
      if (isManual) {
        setTimeout(() => setIsRefreshingAnalytics(false), 400)
      }
    }
  }, [])

  useEffect(() => {
    let ignore = false
    getEvents().then(data => {
      if (!ignore) {
        setEvents(data)
        setIsLoading(false)
      }
    })
    loadAnalytics()

    // Auto-refresh analytics every 30 seconds
    const interval = setInterval(() => {
      loadAnalytics()
    }, 30000)

    return () => {
      ignore = true
      clearInterval(interval)
    }
  }, [loadAnalytics])

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

  // Max views in recent 7 days for relative bar chart scale
  const maxRecentViews = analytics?.recentDays?.reduce((max, d) => Math.max(max, d.views), 0) || 1

  return (
    <div className="admin-page">
      {/* Top Header */}
      <div className="admin-top-bar">
        <div>
          <h1 className="admin-heading">Admin Dashboard</h1>
          <p className="admin-subtitle">Manage passes & track visitor metrics in real-time</p>
        </div>
        <div className="admin-actions-group">
          <button onClick={() => setIsAddingNew(true)} className="btn btn-primary admin-btn-add">
            + Add New Event
          </button>
          <button onClick={handleLogout} className="btn admin-btn-logout">
            Logout
          </button>
        </div>
      </div>

      {/* Visitor Analytics Section */}
      <section className="admin-analytics-section">
        <div className="admin-analytics-header">
          <div className="admin-analytics-title-group">
            <h2 className="admin-analytics-title">Visitor Records & Traffic</h2>
            <div className="admin-live-badge">
              <span className="admin-pulse-dot" />
              <span>
                {analytics ? `${analytics.liveActive} Online Now` : 'Checking live...'}
              </span>
            </div>
          </div>
          <button 
            onClick={() => loadAnalytics(true)} 
            className="admin-analytics-refresh-btn"
            title="Refresh analytics data"
            disabled={isRefreshingAnalytics}
          >
            <svg 
              className={`admin-refresh-icon ${isRefreshingAnalytics ? 'spinning' : ''}`} 
              width="15" 
              height="15" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            <span>{isRefreshingAnalytics ? 'Updating...' : 'Refresh'}</span>
          </button>
        </div>

        {isAnalyticsLoading && !analytics ? (
          <div className="admin-analytics-loading">Loading live metrics...</div>
        ) : (
          <>
            {/* Quick Stat Cards */}
            <div className="admin-analytics-grid">
              <div className="admin-stat-card card-live">
                <div className="admin-stat-header">
                  <span className="admin-stat-label">Live Active</span>
                  <span className="admin-stat-icon-wrap">🟢</span>
                </div>
                <div className="admin-stat-value">{analytics?.liveActive ?? 0}</div>
                <div className="admin-stat-sub">Browsing in last 5 min</div>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-header">
                  <span className="admin-stat-label">Today's Visitors</span>
                  <span className="admin-stat-icon-wrap">👤</span>
                </div>
                <div className="admin-stat-value">
                  {(analytics?.todayUniques ?? 0).toLocaleString()}
                </div>
                <div className="admin-stat-sub">
                  {(analytics?.todayViews ?? 0).toLocaleString()} total page views
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-header">
                  <span className="admin-stat-label">Today's Page Views</span>
                  <span className="admin-stat-icon-wrap">👁️</span>
                </div>
                <div className="admin-stat-value">
                  {(analytics?.todayViews ?? 0).toLocaleString()}
                </div>
                <div className="admin-stat-sub">Passes & home visits</div>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-header">
                  <span className="admin-stat-label">Total Unique Visitors</span>
                  <span className="admin-stat-icon-wrap">🌐</span>
                </div>
                <div className="admin-stat-value">
                  {(analytics?.totalUniques ?? 0).toLocaleString()}
                </div>
                <div className="admin-stat-sub">
                  {(analytics?.totalViews ?? 0).toLocaleString()} all-time views
                </div>
              </div>
            </div>

            {/* Detailed Visual Breakdowns */}
            <div className="admin-analytics-breakdown-grid">
              {/* Last 7 Days Trend */}
              <div className="admin-breakdown-card">
                <div className="admin-breakdown-card-header">
                  <h3 className="admin-breakdown-title">Last 7 Days Trend</h3>
                  <span className="admin-breakdown-tag">Daily Traffic</span>
                </div>
                <div className="admin-trend-list">
                  {analytics?.recentDays && analytics.recentDays.length > 0 ? (
                    analytics.recentDays.map(day => {
                      const percentage = Math.max(8, Math.round((day.views / maxRecentViews) * 100))
                      return (
                        <div key={day.date} className="admin-trend-row">
                          <div className="admin-trend-date">{formatDayLabel(day.date)}</div>
                          <div className="admin-trend-bar-track">
                            <div 
                              className="admin-trend-bar-fill" 
                              style={{ width: `${day.views === 0 ? 0 : percentage}%` }} 
                            />
                          </div>
                          <div className="admin-trend-numbers">
                            <span className="trend-num-uniques"><strong>{day.uniques}</strong> visitors</span>
                            <span className="trend-num-views">({day.views} views)</span>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <p className="admin-empty-text">No traffic recorded yet in past 7 days.</p>
                  )}
                </div>
              </div>

              {/* Top Event Passes */}
              <div className="admin-breakdown-card">
                <div className="admin-breakdown-card-header">
                  <h3 className="admin-breakdown-title">Top Viewed Event Passes</h3>
                  <span className="admin-breakdown-tag">Interest & Demand</span>
                </div>
                <div className="admin-top-events-list">
                  {analytics?.topEvents && analytics.topEvents.length > 0 ? (
                    analytics.topEvents.map((ev, index) => (
                      <div key={ev.id} className="admin-top-event-row">
                        <span className={`admin-event-rank-badge rank-${index + 1}`}>
                          #{index + 1}
                        </span>
                        <div className="admin-top-event-name" title={ev.name}>
                          {ev.name}
                        </div>
                        <span className="admin-top-event-views-badge">
                          <strong>{ev.views.toLocaleString()}</strong> views
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="admin-top-events-empty">
                      <p className="admin-empty-text">
                        Pass views will appear here as users browse specific event passes.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </section>

      {/* Events Management Section */}
      <div className="admin-section-divider" />
      <div className="admin-events-header">
        <h2 className="admin-section-heading">
          All Event Passes ({events.length})
        </h2>
        <button onClick={() => setIsAddingNew(true)} className="btn btn-primary btn-sm">
          + Add Event
        </button>
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
