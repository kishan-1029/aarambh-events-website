'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

function getOrCreateVisitorId(): string {
  if (typeof window === 'undefined') return ''
  try {
    let vid = localStorage.getItem('aarambh_vid')
    if (!vid || vid.length < 5) {
      vid = 'v_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now().toString(36)
      localStorage.setItem('aarambh_vid', vid)
    }
    return vid
  } catch {
    return 'v_' + Math.random().toString(36).substring(2, 10)
  }
}

export default function AnalyticsTracker() {
  const pathname = usePathname()
  const lastTrackedPath = useRef<string | null>(null)

  useEffect(() => {
    // Never track admin panel pages
    if (pathname.startsWith('/admin')) return

    const visitorId = getOrCreateVisitorId()

    // Extract event ID if visiting an event details page (/events/xyz)
    let eventId: string | undefined = undefined
    const match = pathname.match(/^\/events\/([^/]+)/)
    if (match && match[1] && match[1] !== 'book') {
      eventId = match[1]
    }

    const payload = JSON.stringify({
      path: pathname,
      visitorId,
      eventId,
    })

    const sendHit = () => {
      try {
        fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true,
        }).catch(() => {})
      } catch {
        // ignore
      }
    }

    // Send pageview on route change or initial load
    sendHit()
    lastTrackedPath.current = pathname

    // Periodic heartbeat every 45s while tab is visible to keep live visitor status accurate
    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        sendHit()
      }
    }, 45000)

    // Also send hit when tab becomes active again
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        sendHit()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [pathname])

  return null
}
