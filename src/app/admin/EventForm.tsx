'use client'

import { useState } from 'react'
import { Event, addEvent, updateEvent } from '@/actions/eventActions'

type EventFormProps = {
  eventToEdit: Event | null
  onSuccess: () => void
}

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
]

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.avif']

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB

type FormEventDate = {
  id?: string
  date: string
  purchasingPrice: string
  commission: string
  price: string
}

type FormCategory = {
  id: string
  name: string
  dates: FormEventDate[]
}

const DEFAULT_NAVRATRI_DATES: FormEventDate[] = [
  { date: '2026-10-11', purchasingPrice: '1', commission: '', price: '1' },
  { date: '2026-10-12', purchasingPrice: '1', commission: '', price: '1' },
  { date: '2026-10-13', purchasingPrice: '1', commission: '', price: '1' },
  { date: '2026-10-14', purchasingPrice: '1', commission: '', price: '1' },
  { date: '2026-10-15', purchasingPrice: '1', commission: '', price: '1' },
  { date: '2026-10-16', purchasingPrice: '1', commission: '', price: '1' },
  { date: '2026-10-17', purchasingPrice: '1', commission: '', price: '1' },
  { date: '2026-10-18', purchasingPrice: '1', commission: '', price: '1' },
  { date: '2026-10-19', purchasingPrice: '1', commission: '', price: '1' },
]

export default function EventForm({ eventToEdit, onSuccess }: EventFormProps) {
  const [name, setName] = useState(eventToEdit?.name || '')
  const [venue, setVenue] = useState(eventToEdit?.venue || '')
  const [mapLink, setMapLink] = useState(eventToEdit?.mapLink || '')
  const [mapLinkError, setMapLinkError] = useState('')
  const [poster, setPoster] = useState(eventToEdit?.poster || '')
  const [previewUrl, setPreviewUrl] = useState(eventToEdit?.poster || '')
  const [uploadedFileName, setUploadedFileName] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [onlinePrice, setOnlinePrice] = useState(eventToEdit?.onlinePrice?.toString() || '')

  // Category count (1 to 5, default 1)
  const initialCategoryCount = eventToEdit?.categoryCount || (eventToEdit?.categories && eventToEdit.categories.length > 0 ? eventToEdit.categories.length : 1)
  const [categoryCount, setCategoryCount] = useState<number>(initialCategoryCount)

  // Single-pass dates (used when categoryCount === 1)
  const [dates, setDates] = useState<FormEventDate[]>(
    eventToEdit?.dates && eventToEdit.dates.length > 0
      ? eventToEdit.dates.map(d => {
          const purchasing = (d.purchasingPrice ?? d.price ?? '').toString()
          const comm = (d.commission ?? '').toString()
          const p = Number(purchasing || 0)
          const c = Number(comm || 0)
          const finalPrice = String(p + c)
          return {
            id: d.id,
            date: d.date,
            purchasingPrice: purchasing,
            commission: comm,
            price: finalPrice || (d.price ?? '').toString(),
          }
        })
      : DEFAULT_NAVRATRI_DATES.map(d => ({ ...d }))
  )

  // Multi-category states (used when categoryCount > 1)
  const [categories, setCategories] = useState<FormCategory[]>(() => {
    if (eventToEdit?.categories && eventToEdit.categories.length > 0) {
      return eventToEdit.categories.map(c => ({
        id: c.id || `cat-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: c.name,
        dates: c.dates.map(d => {
          const purchasing = (d.purchasingPrice ?? d.price ?? '').toString()
          const comm = (d.commission ?? '').toString()
          const p = Number(purchasing || 0)
          const c = Number(comm || 0)
          const finalPrice = String(p + c)
          return {
            id: d.id,
            date: d.date,
            purchasingPrice: purchasing,
            commission: comm,
            price: finalPrice || (d.price ?? '').toString(),
          }
        }),
      }))
    }
    return []
  })

  const [isSaving, setIsSaving] = useState(false)

  // Handle switching category count safely
  const handleCategoryCountChange = (newCount: number) => {
    if (newCount === categoryCount) return

    if (newCount < categoryCount) {
      const confirmMsg =
        categoryCount - newCount === 1
          ? `Reducing the category count will remove Category ${categoryCount} and its pricing. Continue?`
          : `Reducing the category count will remove Category ${newCount + 1} to ${categoryCount} and their pricing. Continue?`

      if (!window.confirm(confirmMsg)) {
        return
      }

      if (newCount === 1) {
        // If reducing back to 1, preserve Category 1 dates if available
        if (categories.length > 0 && categories[0].dates.length > 0) {
          setDates(categories[0].dates.map(d => ({ ...d })))
        }
      }
      setCategories(prev => prev.slice(0, newCount))
      setCategoryCount(newCount)
      return
    }

    // Increasing category count
    if (categoryCount === 1) {
      // 1 -> 2+
      // Copy event's existing current dates and pricing into Category 1
      const newCats: FormCategory[] = []
      newCats.push({
        id: categories[0]?.id || `cat-1-${Date.now()}`,
        name: categories[0]?.name || '',
        dates: dates.map(d => ({ ...d })),
      })

      for (let i = 2; i <= newCount; i++) {
        if (categories[i - 1]) {
          newCats.push(categories[i - 1])
        } else {
          newCats.push({
            id: `cat-${i}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            name: '',
            dates: DEFAULT_NAVRATRI_DATES.map(d => ({ ...d })),
          })
        }
      }
      setCategories(newCats)
      setCategoryCount(newCount)
    } else {
      // 2 -> 3+
      const newCats = [...categories]
      for (let i = categories.length + 1; i <= newCount; i++) {
        newCats.push({
          id: `cat-${i}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          name: '',
          dates: DEFAULT_NAVRATRI_DATES.map(d => ({ ...d })),
        })
      }
      setCategories(newCats)
      setCategoryCount(newCount)
    }
  }

  // Single category date handlers
  const handleAddDate = () => {
    setDates(prev => [
      ...prev,
      {
        id: `date-${Date.now()}-${Math.random()}`,
        date: '',
        purchasingPrice: '',
        commission: '',
        price: '0',
      },
    ])
  }

  const handleRemoveDate = (index: number) => {
    setDates(prev => {
      const newDates = [...prev]
      newDates.splice(index, 1)
      return newDates
    })
  }

  const handleDateChange = (
    index: number,
    field: 'date' | 'purchasingPrice' | 'commission',
    value: string
  ) => {
    setDates(prev => {
      const newDates = [...prev]
      const current = { ...newDates[index], [field]: value }
      const p = Number(current.purchasingPrice || 0)
      const c = Number(current.commission || 0)
      current.price = String(p + c)
      newDates[index] = current
      return newDates
    })
  }

  // Multi-category handlers
  const handleCategoryNameChange = (catIndex: number, newName: string) => {
    setCategories(prev => {
      const next = [...prev]
      next[catIndex] = { ...next[catIndex], name: newName }
      return next
    })
  }

  const handleAddDateToCategory = (catIndex: number) => {
    setCategories(prev => {
      const next = [...prev]
      const updatedDates = [
        ...next[catIndex].dates,
        {
          id: `date-${Date.now()}-${Math.random()}`,
          date: '',
          purchasingPrice: '',
          commission: '',
          price: '0',
        },
      ]
      next[catIndex] = { ...next[catIndex], dates: updatedDates }
      return next
    })
  }

  const handleRemoveDateFromCategory = (catIndex: number, dateIndex: number) => {
    setCategories(prev => {
      const next = [...prev]
      const updatedDates = [...next[catIndex].dates]
      updatedDates.splice(dateIndex, 1)
      next[catIndex] = { ...next[catIndex], dates: updatedDates }
      return next
    })
  }

  const handleCategoryDateChange = (
    catIndex: number,
    dateIndex: number,
    field: 'date' | 'purchasingPrice' | 'commission',
    value: string
  ) => {
    setCategories(prev => {
      const next = [...prev]
      const updatedDates = [...next[catIndex].dates]
      const current = { ...updatedDates[dateIndex], [field]: value }
      const p = Number(current.purchasingPrice || 0)
      const c = Number(current.commission || 0)
      current.price = String(p + c)
      updatedDates[dateIndex] = current
      next[catIndex] = { ...next[catIndex], dates: updatedDates }
      return next
    })
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadError('')
    setUploadSuccess(false)

    const lowerName = file.name.toLowerCase()
    const lowerType = file.type.toLowerCase()

    // Validate format: JPG, PNG, WEBP, AVIF
    const isValidMime = ALLOWED_MIME_TYPES.includes(lowerType)
    const isValidExt = ALLOWED_EXTENSIONS.some(ext => lowerName.endsWith(ext))

    if (!isValidMime && !isValidExt) {
      setUploadError(
        'Invalid image format. Supported formats: JPG, PNG, WEBP, and AVIF.'
      )
      e.target.value = ''
      return
    }

    // Validate file size: 5 MB maximum
    if (file.size > MAX_FILE_SIZE) {
      const sizeInMb = (file.size / (1024 * 1024)).toFixed(1)
      setUploadError(
        `File size (${sizeInMb} MB) exceeds the 5 MB limit. Please select a file under 5 MB.`
      )
      e.target.value = ''
      return
    }

    // Instant local preview — fully supports AVIF natively
    const localPreview = URL.createObjectURL(file)
    setPreviewUrl(localPreview)
    setUploadedFileName(file.name)

    // Upload to server
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok || !data.url) {
        throw new Error(data.error || 'Failed to upload image.')
      }

      setPoster(data.url)
      setUploadSuccess(true)
    } catch (err: unknown) {
      console.error(err)
      const errorMsg = err instanceof Error ? err.message : 'Upload failed. Please try again.'
      setUploadError(errorMsg)
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !venue.trim() || !poster.trim() || !onlinePrice) {
      alert('Please fill all required fields, including the Event Poster.')
      return
    }

    if (isUploading) {
      alert('Please wait for the image upload to complete.')
      return
    }

    const parsedOnline = parseInt(onlinePrice, 10)
    if (isNaN(parsedOnline) || parsedOnline <= 0) {
      alert('Please enter a valid Online Price greater than 0.')
      return
    }

    const trimmedMapLink = mapLink.trim()
    if (trimmedMapLink) {
      let isValidUrl = false
      try {
        const parsed = new URL(trimmedMapLink)
        if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
          isValidUrl = true
        }
      } catch {
        isValidUrl = false
      }

      if (!isValidUrl) {
        setMapLinkError('Please enter a valid map link.')
        alert('Please enter a valid map link.')
        return
      }
    }
    setMapLinkError('')

    if (categoryCount > 1) {
      // 1. Validate category names (Required for every category when count > 1)
      for (let i = 0; i < categories.length; i++) {
        if (!categories[i].name.trim()) {
          alert(`Please enter a Category Name for Category ${i + 1}.`)
          return
        }
      }

      // 2. Validate no duplicate category names
      const trimmedNames = categories.map(c => c.name.trim().toLowerCase())
      const uniqueNames = new Set(trimmedNames)
      if (uniqueNames.size !== trimmedNames.length) {
        alert('Category names must be unique. Duplicate category names are not allowed.')
        return
      }

      // 3. Validate dates and prices for each category
      for (let i = 0; i < categories.length; i++) {
        const cat = categories[i]
        if (cat.dates.length === 0) {
          alert(`Please add at least one date for Category ${i + 1} (${cat.name.trim()}).`)
          return
        }

        if (
          cat.dates.some(
            d =>
              !d.date ||
              !d.purchasingPrice ||
              !d.purchasingPrice.trim() ||
              isNaN(Number(d.purchasingPrice)) ||
              Number(d.purchasingPrice) < 0
          )
        ) {
          alert(`Please enter a valid Purchasing Price (0 or greater) for all dates in Category "${cat.name.trim()}".`)
          return
        }
      }
    } else {
      // Single category validation
      if (dates.length === 0) {
        alert('Please add at least one event date.')
        return
      }

      if (
        dates.some(
          d =>
            !d.date ||
            !d.purchasingPrice ||
            !d.purchasingPrice.trim() ||
            isNaN(Number(d.purchasingPrice)) ||
            Number(d.purchasingPrice) < 0
        )
      ) {
        alert('Please enter a valid Purchasing Price (0 or greater) for all event dates.')
        return
      }
    }

    setIsSaving(true)

    // Construct eventData according to specification
    const eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'> = {
      name: name.trim(),
      venue: venue.trim(),
      mapLink: trimmedMapLink,
      poster: poster.trim(),
      onlinePrice: parsedOnline,
      categoryCount,
    }

    if (categoryCount > 1) {
      eventData.categories = categories.map(cat => ({
        id: cat.id || `cat-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: cat.name.trim(),
        dates: cat.dates.map(d => {
          const purchasing = Number(d.purchasingPrice || 0)
          const comm = Number(d.commission || 0)
          const finalPrice = String(purchasing + comm)
          return {
            ...(d.id ? { id: d.id } : {}),
            date: d.date,
            purchasingPrice: d.purchasingPrice.trim(),
            commission: d.commission.trim(),
            price: finalPrice,
          }
        }),
      }))
    } else {
      eventData.dates = dates.map(d => {
        const purchasing = Number(d.purchasingPrice || 0)
        const comm = Number(d.commission || 0)
        const finalPrice = String(purchasing + comm)
        return {
          ...(d.id ? { id: d.id } : {}),
          date: d.date,
          purchasingPrice: d.purchasingPrice.trim(),
          commission: d.commission.trim(),
          price: finalPrice,
        }
      })
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
      alert('Failed to save event.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="card admin-form-card">
      <h2 className="admin-form-heading">
        {eventToEdit ? 'Edit Event' : 'Add New Event'}
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group mb-md">
          <label className="form-label">Event Name *</label>
          <input
            type="text"
            className="form-input"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Raatladi"
            style={{ minHeight: '44px' }}
          />
        </div>

        <div className="form-group mb-md">
          <label className="form-label">Venue *</label>
          <input
            type="text"
            className="form-input"
            required
            value={venue}
            onChange={e => setVenue(e.target.value)}
            placeholder="e.g. XYZ Party Plot, Ahmedabad"
            style={{ minHeight: '44px' }}
          />
        </div>

        <div className="form-group mb-md">
          <label className="form-label">Map Link</label>
          <input
            type="text"
            className="form-input"
            value={mapLink}
            onChange={e => {
              setMapLink(e.target.value)
              if (mapLinkError) setMapLinkError('')
            }}
            placeholder="https://maps.google.com/..."
            style={{ minHeight: '44px' }}
          />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
            Optional — paste Google Maps or other map location link
          </span>
          {mapLinkError && (
            <span style={{ fontSize: '0.75rem', color: '#EF4444', marginTop: '4px', display: 'block', fontWeight: 600 }}>
              {mapLinkError}
            </span>
          )}
        </div>

        {/* Poster Upload Section */}
        <div className="form-group mb-md">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '4px' }}>
            <label className="form-label" style={{ margin: 0 }}>Event Poster Image *</label>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              JPG, PNG, WEBP, AVIF (Max 5 MB)
            </span>
          </div>

          {/* Direct File Upload Area */}
          <div className={`admin-poster-dropzone ${uploadError ? 'has-error' : ''}`}>
            <input
              type="file"
              id="poster-file-upload"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={handleFileSelect}
              className="admin-poster-file-input"
              aria-label="Upload poster image in JPG, PNG, WEBP, or AVIF"
            />

            <div style={{ pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--brand)' }}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              <div>
                <span style={{ fontWeight: 600, color: 'var(--brand)', textDecoration: 'underline' }}>
                  Click to select poster image
                </span>
                <span style={{ color: 'var(--text-muted)' }}> or drag and drop</span>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                Directly upload AVIF, WEBP, PNG, or JPG (up to 5 MB)
              </span>
            </div>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <p style={{ fontSize: '0.85rem', color: 'var(--brand)', marginTop: '8px', fontWeight: 600 }}>
              Uploading poster image...
            </p>
          )}

          {/* Upload Error */}
          {uploadError && (
            <div style={{ marginTop: '8px', padding: '8px 12px', backgroundColor: '#FEE2E2', border: '1px solid #FECACA', borderRadius: 'var(--radius-sm)', color: '#B91C1C', fontSize: '0.85rem', fontWeight: 600 }}>
              {uploadError}
            </div>
          )}

          {/* Upload Success */}
          {uploadSuccess && (
            <div style={{ marginTop: '8px', padding: '8px 12px', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 'var(--radius-sm)', color: '#065F46', fontSize: '0.85rem', fontWeight: 600 }}>
              ✓ Image uploaded successfully: {uploadedFileName || poster}
            </div>
          )}

          {/* Uploaded Poster Preview (Supports AVIF, WEBP, PNG, JPG) */}
          {(previewUrl || poster) && (
            <div className="admin-poster-preview-card">
              <img
                src={previewUrl || poster}
                alt="Event Poster Preview"
                className="admin-poster-preview-img"
              />
              <div style={{ minWidth: 0, flex: 1 }}>
                <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {uploadedFileName || 'Poster Preview'}
                </p>
                <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>
                  Ready to save with event
                </span>
              </div>
            </div>
          )}

          {/* Optional URL Input Alternative */}
          <div style={{ marginTop: '10px' }}>
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              style={{
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline',
                padding: 0,
              }}
            >
              {showUrlInput ? 'Hide manual URL input' : 'Or paste image URL manually'}
            </button>

            {showUrlInput && (
              <div style={{ marginTop: '8px' }}>
                <input
                  type="url"
                  className="form-input"
                  value={poster}
                  onChange={e => {
                    setPoster(e.target.value)
                    setPreviewUrl(e.target.value)
                    setUploadError('')
                  }}
                  placeholder="https://..."
                  style={{ minHeight: '40px', fontSize: '0.9rem' }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Online Price */}
        <div className="form-group mb-md">
          <label className="form-label">Online Price (₹) *</label>
          <input
            type="text"
            inputMode="numeric"
            className="form-input"
            required
            placeholder="e.g. 799"
            value={onlinePrice}
            onChange={e => {
              const sanitized = e.target.value.replace(/\D/g, '')
              setOnlinePrice(sanitized)
            }}
            style={{ minHeight: '44px' }}
          />
        </div>

        {/* Number of Categories */}
        <div className="form-group mb-md">
          <label className="form-label" style={{ fontWeight: 600 }}>Number of Categories</label>
          <select
            className="form-input"
            value={categoryCount}
            onChange={e => handleCategoryCountChange(parseInt(e.target.value, 10))}
            style={{ minHeight: '44px', fontWeight: 600 }}
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            {categoryCount === 1
              ? 'Default: 1 category (normal single-pass event).'
              : `${categoryCount} pass categories with independent names and separate pricing.`}
          </p>
        </div>

        {/* Single Pass Dates & Prices (When categoryCount === 1) */}
        {categoryCount === 1 && (
          <div className="admin-pricing-card">
            <div className="admin-pricing-card-header">
              <div>
                <h3 style={{ fontSize: '1.125rem', margin: 0 }}>Dates and Prices *</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                  Aarambh Price is automatically calculated as Purchasing Price + Commission.
                </p>
              </div>
              <button type="button" onClick={handleAddDate} className="btn btn-outline admin-btn-add-date">
                + Add Date
              </button>
            </div>

            {dates.map((dateObj, index) => (
              <div key={dateObj.id || `date-row-${index}`} className="admin-date-row">
                {/* Date Column */}
                <div className="admin-date-col">
                  <label className="form-label" style={{ fontSize: '0.85rem' }}>Date *</label>
                  <input
                    type="date"
                    className="form-input"
                    required
                    value={dateObj.date}
                    onChange={e => handleDateChange(index, 'date', e.target.value)}
                    style={{ minHeight: '44px' }}
                  />
                </div>

                {/* Purchasing Price & Commission Column Group (splits into 2 columns on mobile) */}
                <div className="admin-price-cols-split">
                  {/* Purchasing Price */}
                  <div className="admin-date-col">
                    <label className="form-label" style={{ fontSize: '0.85rem' }}>Purchasing Price (₹) *</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      className="form-input"
                      required
                      placeholder="e.g. 150"
                      value={dateObj.purchasingPrice}
                      onChange={e => {
                        const sanitized = e.target.value.replace(/\D/g, '')
                        handleDateChange(index, 'purchasingPrice', sanitized)
                      }}
                      style={{ minHeight: '44px' }}
                    />
                  </div>

                  {/* Commission (Optional, can be blank) */}
                  <div className="admin-date-col">
                    <label className="form-label" style={{ fontSize: '0.85rem' }}>Commission (₹)</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      className="form-input"
                      placeholder="0"
                      value={dateObj.commission}
                      onChange={e => {
                        const sanitized = e.target.value.replace(/\D/g, '')
                        handleDateChange(index, 'commission', sanitized)
                      }}
                      style={{ minHeight: '44px' }}
                    />
                  </div>
                </div>

                {/* Aarambh Price (Read-only, auto-calculated) */}
                <div className="admin-date-col">
                  <label className="form-label" style={{ fontSize: '0.85rem' }}>Aarambh Price (₹)</label>
                  <input
                    type="text"
                    readOnly
                    className="form-input admin-price-readonly-input"
                    value={`₹${dateObj.price || '0'}`}
                    aria-label="Calculated Aarambh Price"
                    title="Auto-calculated (Purchasing Price + Commission)"
                  />
                </div>

                {/* Remove Date Button */}
                {dates.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => handleRemoveDate(index)}
                    className="admin-date-remove-btn"
                    aria-label="Remove date"
                    title="Remove date"
                  >
                    <span className="admin-remove-icon" aria-hidden="true">✕</span>
                    <span className="admin-remove-text">Remove Date</span>
                  </button>
                ) : (
                  <div className="admin-date-remove-spacer" />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Multi-Category Panels (When categoryCount >= 2) */}
        {categoryCount > 1 && (
          <div className="admin-categories-list">
            {categories.map((cat, catIndex) => (
              <div
                key={cat.id || `cat-panel-${catIndex}`}
                className="admin-category-card"
              >
                {/* Category Header */}
                <div className="admin-category-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        backgroundColor: 'var(--brand)',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-xs, 4px)',
                        letterSpacing: '0.05em',
                      }}
                    >
                      CATEGORY {catIndex + 1}
                    </span>
                    {cat.name && (
                      <span style={{ fontWeight: 600, fontSize: '1.05rem', color: 'var(--text)' }}>
                        — {cat.name}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddDateToCategory(catIndex)}
                    className="btn btn-outline admin-btn-add-date"
                  >
                    + Add Date
                  </button>
                </div>

                {/* Category Name Input */}
                <div className="form-group mb-md">
                  <label className="form-label" style={{ fontWeight: 600 }}>
                    Category Name <span className="req-star">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    value={cat.name}
                    onChange={e => handleCategoryNameChange(catIndex, e.target.value)}
                    placeholder="e.g. Gold, Platinum, VIP, Diamond, General, Premium, Couple"
                    style={{ minHeight: '44px', fontWeight: 600 }}
                  />
                </div>

                {/* Dates & Prices for this category */}
                <div style={{ marginTop: '16px' }}>
                  <label className="form-label" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>
                    Dates & Prices for {cat.name.trim() || `Category ${catIndex + 1}`} *
                  </label>

                  {cat.dates.map((dateObj, dIndex) => (
                    <div key={dateObj.id || `cat-${catIndex}-date-${dIndex}`} className="admin-date-row">
                      {/* Date Column */}
                      <div className="admin-date-col">
                        <label className="form-label" style={{ fontSize: '0.85rem' }}>Date *</label>
                        <input
                          type="date"
                          className="form-input"
                          required
                          value={dateObj.date}
                          onChange={e => handleCategoryDateChange(catIndex, dIndex, 'date', e.target.value)}
                          style={{ minHeight: '44px' }}
                        />
                      </div>

                      {/* Purchasing Price & Commission */}
                      <div className="admin-price-cols-split">
                        <div className="admin-date-col">
                          <label className="form-label" style={{ fontSize: '0.85rem' }}>Purchasing Price (₹) *</label>
                          <input
                            type="text"
                            inputMode="numeric"
                            className="form-input"
                            required
                            placeholder="e.g. 150"
                            value={dateObj.purchasingPrice}
                            onChange={e => {
                              const sanitized = e.target.value.replace(/\D/g, '')
                              handleCategoryDateChange(catIndex, dIndex, 'purchasingPrice', sanitized)
                            }}
                            style={{ minHeight: '44px' }}
                          />
                        </div>

                        <div className="admin-date-col">
                          <label className="form-label" style={{ fontSize: '0.85rem' }}>Commission (₹)</label>
                          <input
                            type="text"
                            inputMode="numeric"
                            className="form-input"
                            placeholder="0"
                            value={dateObj.commission}
                            onChange={e => {
                              const sanitized = e.target.value.replace(/\D/g, '')
                              handleCategoryDateChange(catIndex, dIndex, 'commission', sanitized)
                            }}
                            style={{ minHeight: '44px' }}
                          />
                        </div>
                      </div>

                      {/* Aarambh Price (Read-only, auto-calculated) */}
                      <div className="admin-date-col">
                        <label className="form-label" style={{ fontSize: '0.85rem' }}>Aarambh Price (₹)</label>
                        <input
                          type="text"
                          readOnly
                          className="form-input admin-price-readonly-input"
                          value={`₹${dateObj.price || '0'}`}
                          aria-label="Calculated Aarambh Price"
                          title="Auto-calculated (Purchasing Price + Commission)"
                        />
                      </div>

                      {/* Remove Date Button */}
                      {cat.dates.length > 1 ? (
                        <button
                          type="button"
                          onClick={() => handleRemoveDateFromCategory(catIndex, dIndex)}
                          className="admin-date-remove-btn"
                          aria-label="Remove date"
                          title="Remove date"
                        >
                          <span className="admin-remove-icon" aria-hidden="true">✕</span>
                          <span className="admin-remove-text">Remove Date</span>
                        </button>
                      ) : (
                        <div className="admin-date-remove-spacer" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary admin-btn-save"
          disabled={isSaving || isUploading}
        >
          {isSaving ? 'Saving...' : (eventToEdit ? 'UPDATE EVENT' : 'SAVE EVENT')}
        </button>
      </form>
    </div>
  )
}
