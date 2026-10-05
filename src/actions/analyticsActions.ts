'use server'

import fs from 'fs/promises'
import path from 'path'
import crypto from 'crypto'
import { getEvents } from './eventActions'

export type AnalyticsSummary = {
  liveActive: number
  todayViews: number
  todayUniques: number
  totalViews: number
  totalUniques: number
  topEvents: { id: string; name: string; views: number }[]
  recentDays: { date: string; views: number; uniques: number }[]
}

type StoredAnalytics = {
  totalViews: number
  allTimeUniques: number
  allTimeVisitors: Record<string, boolean>
  daily: Record<
    string,
    {
      views: number
      uniques: number
      visitors: string[]
    }
  >
  activeVisitors: Record<string, number>
  eventViews: Record<string, number>
}

const dataPath = path.join(process.cwd(), 'src/data/analytics.json')
const tempPath = path.join(process.cwd(), 'src/data/analytics.tmp.json')

function getTodayString(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

async function loadAnalyticsFromDisk(): Promise<StoredAnalytics> {
  try {
    const raw = await fs.readFile(dataPath, 'utf-8')
    const parsed = JSON.parse(raw)
    return {
      totalViews: typeof parsed.totalViews === 'number' ? parsed.totalViews : 0,
      allTimeUniques: typeof parsed.allTimeUniques === 'number' ? parsed.allTimeUniques : 0,
      allTimeVisitors: parsed.allTimeVisitors || {},
      daily: parsed.daily || {},
      activeVisitors: parsed.activeVisitors || {},
      eventViews: parsed.eventViews || {},
    }
  } catch {
    return {
      totalViews: 0,
      allTimeUniques: 0,
      allTimeVisitors: {},
      daily: {},
      activeVisitors: {},
      eventViews: {},
    }
  }
}

async function saveAnalyticsToDisk(data: StoredAnalytics): Promise<void> {
  try {
    const dir = path.dirname(dataPath)
    await fs.mkdir(dir, { recursive: true })
    const serialized = JSON.stringify(data, null, 2)
    await fs.writeFile(tempPath, serialized, 'utf-8')
    await fs.rename(tempPath, dataPath)
  } catch (err) {
    console.error('Failed to save analytics to disk:', err)
  }
}

export async function trackPageView(
  pathname: string,
  ip: string,
  userAgent: string,
  visitorId?: string,
  eventId?: string
) {
  // Never track admin panel pages
  if (pathname.startsWith('/admin')) {
    return { success: true }
  }

  const data = await loadAnalyticsFromDisk()
  const now = Date.now()
  const today = getTodayString()

  // Use client-generated visitorId if available; fallback to hashed IP + UA
  let visitorKey = visitorId && visitorId.trim().length > 3 ? visitorId.trim() : ''
  if (!visitorKey) {
    const raw = `${ip || '127.0.0.1'}-${userAgent || 'unknown'}`
    visitorKey = crypto.createHash('sha256').update(raw).digest('hex').substring(0, 16)
  }

  // 1. Total views
  data.totalViews = (data.totalViews || 0) + 1

  // 2. All-time unique visitors
  if (!data.allTimeVisitors) data.allTimeVisitors = {}
  if (!data.allTimeVisitors[visitorKey]) {
    data.allTimeVisitors[visitorKey] = true
    data.allTimeUniques = Object.keys(data.allTimeVisitors).length

    // Limit memory footprint of allTimeVisitors keys to 25k
    const allKeys = Object.keys(data.allTimeVisitors)
    if (allKeys.length > 25000) {
      const trimmed: Record<string, boolean> = {}
      allKeys.slice(-15000).forEach(k => {
        trimmed[k] = true
      })
      data.allTimeVisitors = trimmed
    }
  }

  // 3. Daily views & unique visitors
  if (!data.daily) data.daily = {}
  if (!data.daily[today]) {
    data.daily[today] = { views: 0, uniques: 0, visitors: [] }
  }

  const todayRecord = data.daily[today]
  todayRecord.views = (todayRecord.views || 0) + 1

  if (!todayRecord.visitors.includes(visitorKey)) {
    todayRecord.visitors.push(visitorKey)
    todayRecord.uniques = todayRecord.visitors.length
  }

  // Clean up daily records older than 60 days
  const allDays = Object.keys(data.daily).sort()
  if (allDays.length > 60) {
    const toRemove = allDays.slice(0, allDays.length - 60)
    for (const oldDay of toRemove) {
      delete data.daily[oldDay]
    }
  }

  // 4. Real-time active visitors (active in last 5 minutes)
  if (!data.activeVisitors) data.activeVisitors = {}
  data.activeVisitors[visitorKey] = now

  const fiveMinutesAgo = now - 5 * 60 * 1000
  for (const [key, timestamp] of Object.entries(data.activeVisitors)) {
    if (timestamp < fiveMinutesAgo) {
      delete data.activeVisitors[key]
    }
  }

  // 5. Specific event views
  if (eventId) {
    if (!data.eventViews) data.eventViews = {}
    data.eventViews[eventId] = (data.eventViews[eventId] || 0) + 1
  }

  // Immediately persist so refresh always shows real-time data
  await saveAnalyticsToDisk(data)
  return { success: true }
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const data = await loadAnalyticsFromDisk()
  const now = Date.now()
  const today = getTodayString()

  // Clean & count active visitors in the last 5 minutes
  const fiveMinutesAgo = now - 5 * 60 * 1000
  let liveActive = 0
  let activeChanged = false

  if (data.activeVisitors) {
    for (const [key, timestamp] of Object.entries(data.activeVisitors)) {
      if (timestamp >= fiveMinutesAgo) {
        liveActive++
      } else {
        delete data.activeVisitors[key]
        activeChanged = true
      }
    }
  }

  if (activeChanged) {
    // Non-blocking cleanup save
    saveAnalyticsToDisk(data).catch(() => {})
  }

  // Today stats
  const todayRecord = data.daily?.[today] || { views: 0, uniques: 0, visitors: [] }

  // Resolve top event names
  const allEvents = await getEvents()
  const eventNameMap = new Map(allEvents.map(e => [e.id, e.name]))

  const topEvents: { id: string; name: string; views: number }[] = []
  if (data.eventViews) {
    const entries = Object.entries(data.eventViews)
    entries.sort((a, b) => b[1] - a[1])
    for (const [id, views] of entries.slice(0, 5)) {
      topEvents.push({
        id,
        name: eventNameMap.get(id) || id,
        views,
      })
    }
  }

  // Last 7 days trend
  const recentDays: { date: string; views: number; uniques: number }[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now - i * 24 * 60 * 60 * 1000)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const key = `${y}-${m}-${day}`
    const record = data.daily?.[key]
    recentDays.push({
      date: key,
      views: record ? record.views : 0,
      uniques: record ? record.uniques : 0,
    })
  }

  return {
    liveActive,
    todayViews: todayRecord.views || 0,
    todayUniques: todayRecord.uniques || 0,
    totalViews: data.totalViews || 0,
    totalUniques: data.allTimeUniques || todayRecord.uniques || 0,
    topEvents,
    recentDays,
  }
}
