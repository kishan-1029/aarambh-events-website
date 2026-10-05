'use client'

import { useState, useMemo } from 'react'
import { Event } from '@/actions/eventActions'
import EventCard from './EventCard'

type EventFiltersSectionProps = {
  events: Event[]
}

const DATE_OPTIONS = [
  'All Dates',
  '11 Oct',
  '12 Oct',
  '13 Oct',
  '14 Oct',
  '15 Oct',
  '16 Oct',
  '17 Oct',
  '18 Oct',
  '19 Oct',
]

const PRICE_OPTIONS = [
  'All Prices',
  'Under ₹500',
  '₹500–₹1000',
  '₹1000–₹1500',
  '₹1500+',
]

const SORT_OPTIONS = [
  'Default',
  'Price: Low to High',
  'Price: High to Low',
  'Newest First',
]

function isDateMatch(eventDateStr: string, filterDate: string): boolean {
  if (!filterDate || filterDate === 'All Dates') return true

  const [dayStr] = filterDate.split(' ')
  const day = parseInt(dayStr, 10)
  if (isNaN(day)) return true

  const paddedDay = day.toString().padStart(2, '0')

  if (
    eventDateStr.includes(`-10-${paddedDay}`) ||
    eventDateStr.startsWith(`${paddedDay}-10-`) ||
    eventDateStr.endsWith(`-${paddedDay}`)
  ) {
    return true
  }

  try {
    const d = new Date(eventDateStr)
    if (!isNaN(d.getTime())) {
      return d.getDate() === day && d.getMonth() === 9 // Month 9 is October
    }
  } catch {
    // fallback
  }

  return false
}

function getEffectivePrice(event: Event, selectedDate: string): number | null {
  const isDateSpecific = selectedDate && selectedDate !== 'All Dates'
  const prices: number[] = []

  if (event.categoryCount && event.categoryCount > 1 && event.categories && event.categories.length > 0) {
    for (const cat of event.categories) {
      for (const d of cat.dates || []) {
        if (!isDateSpecific || isDateMatch(d.date, selectedDate)) {
          const p = Number(d.price)
          if (!isNaN(p) && p > 0) {
            prices.push(p)
          }
        }
      }
    }
  } else if (event.dates && event.dates.length > 0) {
    for (const d of event.dates) {
      if (!isDateSpecific || isDateMatch(d.date, selectedDate)) {
        const p = Number(d.price)
        if (!isNaN(p) && p > 0) {
          prices.push(p)
        }
      }
    }
  }

  if (prices.length === 0) return null
  return Math.min(...prices)
}

function hasMatchingDate(event: Event, filterDate: string): boolean {
  if (!filterDate || filterDate === 'All Dates') return true

  if (event.categoryCount && event.categoryCount > 1 && event.categories && event.categories.length > 0) {
    return event.categories.some(cat =>
      cat.dates && cat.dates.some(d => isDateMatch(d.date, filterDate))
    )
  }

  return Boolean(event.dates && event.dates.some(d => isDateMatch(d.date, filterDate)))
}

function matchesPrice(effectivePrice: number | null, priceFilter: string): boolean {
  if (!priceFilter || priceFilter === 'All Prices') return true
  if (effectivePrice === null) return false

  switch (priceFilter) {
    case 'Under ₹500':
      return effectivePrice < 500
    case '₹500–₹1000':
    case '₹500-₹1000':
      return effectivePrice >= 500 && effectivePrice < 1000
    case '₹1000–₹1500':
    case '₹1000-₹1500':
      return effectivePrice >= 1000 && effectivePrice < 1500
    case '₹1500+':
      return effectivePrice >= 1500
    default:
      return true
  }
}

function matchesSearch(event: Event, query: string): boolean {
  if (!query || !query.trim()) return true
  const q = query.trim().toLowerCase()
  const name = (event.name || '').toLowerCase()
  const venue = (event.venue || '').toLowerCase()
  return name.includes(q) || venue.includes(q)
}

function matchesVenue(eventVenue: string, venueFilter: string): boolean {
  if (!venueFilter || venueFilter === 'All Venues') return true
  return (eventVenue || '').trim().toLowerCase() === venueFilter.trim().toLowerCase()
}

export default function EventFiltersSection({ events }: EventFiltersSectionProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDate, setSelectedDate] = useState('All Dates')
  const [selectedPrice, setSelectedPrice] = useState('All Prices')
  const [selectedVenue, setSelectedVenue] = useState('All Venues')
  const [sortBy, setSortBy] = useState('Default')
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)

  // Dynamically extract and sort unique venues
  const venueOptions = useMemo(() => {
    const set = new Set<string>()
    events.forEach(e => {
      if (e.venue && e.venue.trim()) {
        set.add(e.venue.trim())
      }
    })
    return ['All Venues', ...Array.from(set).sort((a, b) => a.localeCompare(b))]
  }, [events])

  // Count active filters (excluding default states)
  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (searchQuery.trim() !== '') count++
    if (selectedDate !== 'All Dates') count++
    if (selectedPrice !== 'All Prices') count++
    if (selectedVenue !== 'All Venues') count++
    if (sortBy !== 'Default') count++
    return count
  }, [searchQuery, selectedDate, selectedPrice, selectedVenue, sortBy])

  const isFiltered = activeFiltersCount > 0

  const handleClearFilters = () => {
    setSearchQuery('')
    setSelectedDate('All Dates')
    setSelectedPrice('All Prices')
    setSelectedVenue('All Venues')
    setSortBy('Default')
  }

  // Filter & sort logic
  const filteredEvents = useMemo(() => {
    const list = events.filter(event => {
      // 1. Search Query
      if (!matchesSearch(event, searchQuery)) return false

      // 2. Date
      if (!hasMatchingDate(event, selectedDate)) return false

      // 3. Price
      const effPrice = getEffectivePrice(event, selectedDate)
      if (!matchesPrice(effPrice, selectedPrice)) return false

      // 4. Venue
      if (!matchesVenue(event.venue, selectedVenue)) return false

      return true
    })

    // Sort list
    if (sortBy === 'Price: Low to High') {
      return [...list].sort((a, b) => {
        const pA = getEffectivePrice(a, selectedDate) ?? Infinity
        const pB = getEffectivePrice(b, selectedDate) ?? Infinity
        return pA - pB
      })
    }
    if (sortBy === 'Price: High to Low') {
      return [...list].sort((a, b) => {
        const pA = getEffectivePrice(a, selectedDate) ?? -Infinity
        const pB = getEffectivePrice(b, selectedDate) ?? -Infinity
        return pB - pA
      })
    }
    if (sortBy === 'Newest First') {
      return [...list].sort((a, b) => {
        const tA = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const tB = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return tB - tA
      })
    }

    return list
  }, [events, searchQuery, selectedDate, selectedPrice, selectedVenue, sortBy])

  return (
    <section id="passes" className="passes-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header-compact">
          <h2 className="section-title">Available Events</h2>
        </div>

        {/* Public Filter Controls Bar */}
        <div className="event-filters-wrapper">
          {/* Top row: Search input + Mobile filter toggle */}
          <div className="event-filters-main-row">
            {/* Search Input */}
            <div className="event-search-box">
              <svg
                className="event-search-icon"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                id="event-search-input"
                className="event-search-input"
                placeholder="Search Events..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                aria-label="Search Events by name or venue"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="event-search-clear-btn"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search query"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Mobile Filters Toggle Button */}
            <button
              type="button"
              className={`event-mobile-filter-btn ${isMobileFiltersOpen ? 'active' : ''}`}
              onClick={() => setIsMobileFiltersOpen(prev => !prev)}
              aria-expanded={isMobileFiltersOpen}
              aria-controls="mobile-filter-drawer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
              </svg>
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="event-filter-count-badge">{activeFiltersCount}</span>
              )}
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`event-chevron-icon ${isMobileFiltersOpen ? 'rotate-180' : ''}`}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            {/* Desktop Filter Dropdowns (Inline on desktop) */}
            <div className="event-desktop-selects">
              {/* Date Filter */}
              <div className="event-filter-select-wrap">
                <select
                  id="filter-date-desktop"
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                  className={`event-filter-select ${selectedDate !== 'All Dates' ? 'has-value' : ''}`}
                  aria-label="Filter by Date"
                >
                  {DATE_OPTIONS.map(d => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <span className="event-select-chevron" aria-hidden="true">▼</span>
              </div>

              {/* Price Range Filter */}
              <div className="event-filter-select-wrap">
                <select
                  id="filter-price-desktop"
                  value={selectedPrice}
                  onChange={e => setSelectedPrice(e.target.value)}
                  className={`event-filter-select ${selectedPrice !== 'All Prices' ? 'has-value' : ''}`}
                  aria-label="Filter by Price Range"
                >
                  {PRICE_OPTIONS.map(p => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                <span className="event-select-chevron" aria-hidden="true">▼</span>
              </div>

              {/* Venue Filter */}
              <div className="event-filter-select-wrap">
                <select
                  id="filter-venue-desktop"
                  value={selectedVenue}
                  onChange={e => setSelectedVenue(e.target.value)}
                  className={`event-filter-select ${selectedVenue !== 'All Venues' ? 'has-value' : ''}`}
                  aria-label="Filter by Venue"
                >
                  {venueOptions.map(v => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
                <span className="event-select-chevron" aria-hidden="true">▼</span>
              </div>

              {/* Sort By Filter */}
              <div className="event-filter-select-wrap">
                <select
                  id="filter-sort-desktop"
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className={`event-filter-select ${sortBy !== 'Default' ? 'has-value' : ''}`}
                  aria-label="Sort Events"
                >
                  {SORT_OPTIONS.map(s => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <span className="event-select-chevron" aria-hidden="true">▼</span>
              </div>

              {/* Desktop Clear Filters button */}
              {isFiltered && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="event-filter-clear-btn"
                  title="Clear all active filters"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Mobile Filter Drawer / Expandable Section */}
          <div
            id="mobile-filter-drawer"
            className={`event-mobile-filter-drawer ${isMobileFiltersOpen ? 'is-open' : ''}`}
          >
            <div className="event-mobile-filter-grid">
              {/* Date Filter */}
              <div className="event-mobile-field">
                <label htmlFor="filter-date-mobile" className="event-mobile-field-label">Date</label>
                <div className="event-filter-select-wrap">
                  <select
                    id="filter-date-mobile"
                    value={selectedDate}
                    onChange={e => setSelectedDate(e.target.value)}
                    className={`event-filter-select ${selectedDate !== 'All Dates' ? 'has-value' : ''}`}
                  >
                    {DATE_OPTIONS.map(d => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  <span className="event-select-chevron" aria-hidden="true">▼</span>
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="event-mobile-field">
                <label htmlFor="filter-price-mobile" className="event-mobile-field-label">Price Range</label>
                <div className="event-filter-select-wrap">
                  <select
                    id="filter-price-mobile"
                    value={selectedPrice}
                    onChange={e => setSelectedPrice(e.target.value)}
                    className={`event-filter-select ${selectedPrice !== 'All Prices' ? 'has-value' : ''}`}
                  >
                    {PRICE_OPTIONS.map(p => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  <span className="event-select-chevron" aria-hidden="true">▼</span>
                </div>
              </div>

              {/* Venue Filter */}
              <div className="event-mobile-field">
                <label htmlFor="filter-venue-mobile" className="event-mobile-field-label">Venue</label>
                <div className="event-filter-select-wrap">
                  <select
                    id="filter-venue-mobile"
                    value={selectedVenue}
                    onChange={e => setSelectedVenue(e.target.value)}
                    className={`event-filter-select ${selectedVenue !== 'All Venues' ? 'has-value' : ''}`}
                  >
                    {venueOptions.map(v => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                  <span className="event-select-chevron" aria-hidden="true">▼</span>
                </div>
              </div>

              {/* Sort By Filter */}
              <div className="event-mobile-field">
                <label htmlFor="filter-sort-mobile" className="event-mobile-field-label">Sort By</label>
                <div className="event-filter-select-wrap">
                  <select
                    id="filter-sort-mobile"
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className={`event-filter-select ${sortBy !== 'Default' ? 'has-value' : ''}`}
                  >
                    {SORT_OPTIONS.map(s => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <span className="event-select-chevron" aria-hidden="true">▼</span>
                </div>
              </div>
            </div>

            {/* Mobile Actions: Clear Filters & Close */}
            <div className="event-mobile-drawer-actions">
              {isFiltered && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="event-filter-clear-btn mobile-full"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Active summary row on mobile when collapsed */}
          {isFiltered && !isMobileFiltersOpen && (
            <div className="event-active-filters-summary">
              <span className="active-count-text">
                {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
              </span>
              <button
                type="button"
                onClick={handleClearFilters}
                className="event-quick-reset-btn"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Results Count & Status */}
        {isFiltered && (
          <div className="event-results-info-bar">
            <span>
              Showing {filteredEvents.length} of {events.length} events
            </span>
          </div>
        )}

        {/* Events Grid or No Results */}
        {filteredEvents.length > 0 ? (
          <div className="events-grid">
            {filteredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="no-events-card event-no-results-card">
            <div className="no-results-icon" aria-hidden="true">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--brand)' }}>
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
              </svg>
            </div>
            <p className="no-results-title">No events found matching your filters.</p>
            <p className="no-results-subtitle">Try adjusting your search query, date, or price range.</p>
            <button
              type="button"
              onClick={handleClearFilters}
              className="btn btn-outline"
              style={{ marginTop: '12px', minHeight: '44px' }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
