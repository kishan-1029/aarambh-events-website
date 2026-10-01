'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function RouteScrollTop() {
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        if ('scrollRestoration' in window.history) {
          window.history.scrollRestoration = 'manual'
        }
      } catch {
        // ignore
      }

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto',
      })

      const rafId = requestAnimationFrame(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'auto',
        })
      })

      return () => cancelAnimationFrame(rafId)
    }
  }, [pathname])

  return null
}
