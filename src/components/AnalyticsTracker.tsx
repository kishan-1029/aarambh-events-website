'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export default function AnalyticsTracker() {
  const pathname = usePathname()
  const lastTrackedPath = useRef<string | null>(null)

  useEffect(() => {
    // Avoid double counting same path in rapid succession
    if (lastTrackedPath.current === pathname) return
    lastTrackedPath.current = pathname

    // Extract event ID if visiting an event details page (/events/event-xyz)
    let eventId: string | undefined = undefined
    const match = pathname.match(/^\/events\/([^/]+)/)
    if (match && match[1] && match[1] !== 'book') {
      eventId = match[1]
    }

    const payload = JSON.stringify({
      path: pathname,
      eventId,
    })

    const sendHit = () => {
      try {
        if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
          const blob = new Blob([payload], { type: 'application/json' })
          const sent = navigator.sendBeacon('/api/analytics/track', blob)
          if (!sent) {
            fetch('/api/analytics/track', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: payload,
              keepalive: true,
            }).catch(() => {})
          }
        } else {
          fetch('/api/analytics/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payload,
            keepalive: true,
          }).catch(() => {})
        }
      } catch {
        // ignore
      }
    }

    sendHit()

    // Heartbeat every 90 seconds while tab is active to maintain live online accuracy
    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
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
    }, 90000)

    return () => clearInterval(interval)
  }, [pathname])

  return null
}
