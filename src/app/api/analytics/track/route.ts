import { NextRequest, NextResponse } from 'next/server'
import { trackPageView } from '@/actions/analyticsActions'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    let body: any = {}
    try {
      const contentType = request.headers.get('content-type') || ''
      if (contentType.includes('application/json')) {
        body = await request.json()
      } else {
        const text = await request.text()
        body = text ? JSON.parse(text) : {}
      }
    } catch {
      body = {}
    }

    const pathname = typeof body.path === 'string' ? body.path : '/'
    const eventId = typeof body.eventId === 'string' ? body.eventId : undefined

    // Extract client IP and user agent safely
    const forwardedFor = request.headers.get('x-forwarded-for')
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    await trackPageView(pathname, ip, userAgent, eventId)

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
