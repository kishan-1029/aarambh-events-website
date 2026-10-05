import { NextResponse } from 'next/server'
import { getAnalyticsSummary } from '@/actions/analyticsActions'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const summary = await getAnalyticsSummary()
    return NextResponse.json(summary, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    })
  } catch (err) {
    console.error('Error fetching analytics summary:', err)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
