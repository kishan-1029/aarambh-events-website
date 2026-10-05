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
  allTimeHashes: Record<string, boolean>
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

// In-memory cache for fast read/write and debounced disk persistence
let memoryData: StoredAnalytics | null = null
let isDirty = false
let saveTimeout: NodeJS.Timeout | null = null

function getTodayString(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

async function loadAnalyticsFromDisk(): Promise<StoredAnalytics> {
  if (memoryData) return memoryData

  try {
    const raw = await fs.readFile(dataPath, 'utf-8')
    memoryData = JSON.parse(raw) as StoredAnalytics
  } catch {
    memoryData = {
      totalViews: 0,
      allTimeUniques: 0,
      allTimeHashes: {},
      daily: {},
      activeVisitors: {},
      eventViews: {},
    }
  }

  return memoryData
}

async function flushToDisk() {
  if (!isDirty || !memoryData) return
  isDirty = false

  try {
    const dir = path.dirname(dataPath)
    await fs.mkdir(dir, { recursive: true })
    const serialized = JSON.stringify(memoryData, null, 2)
    await fs.writeFile(tempPath, serialized, 'utf-8')
    await fs.rename(tempPath, dataPath)
  } catch (err) {
    console.error('Failed to flush analytics to disk:', err)
  }
}

function scheduleSave() {
  isDirty = true
  if (saveTimeout) return
  saveTimeout = setTimeout(() => {
    saveTimeout = null
    flushToDisk().catch(() => {})
  }, 2000)
}

export async function trackPageView(
  pathname: string,
  ip: string,
  userAgent: string,
  eventId?: string
) {
  // Ignore tracking for admin routes
  if (pathname.startsWith('/admin')) {
    return { success: true }
  }

  const data = await loadAnalyticsFromDisk()
  const now = Date.now()
  const today = getTodayString()

  // Generate anonymized daily hash for unique visitor tracking
  const rawHashInput = `${ip || '127.0.0.1'}-${userAgent || 'unknown'}-${today}`
  const visitorHash = crypto
    .createHash('sha256')
    .update(rawHashInput)
    .digest('hex')
    .substring(0, 16)

  // 1. Increment total views
  data.totalViews = (data.totalViews || 0) + 1

  // 2. Track all-time unique
  if (!data.allTimeHashes) data.allTimeHashes = {}
  if (!data.allTimeHashes[visitorHash]) {
    data.allTimeHashes[visitorHash] = true
    data.allTimeUniques = (data.allTimeUniques || 0) + 1

    // Keep allTimeHashes from growing infinitely (keep most recent 20,000)
    const keys = Object.keys(data.allTimeHashes)
    if (keys.length > 25000) {
      const trimmed: Record<string, boolean> = {}
      keys.slice(-15000).forEach(k => {
        trimmed[k] = true
      })
      data.allTimeHashes = trimmed
    }
  }

  // 3. Track daily views and unique visitors
  if (!data.daily) data.daily = {}
  if (!data.daily[today]) {
    data.daily[today] = { views: 0, uniques: 0, visitors: [] }
  }

  const todayRecord = data.daily[today]
  todayRecord.views = (todayRecord.views || 0) + 1

  if (!todayRecord.visitors.includes(visitorHash)) {
    todayRecord.visitors.push(visitorHash)
    todayRecord.uniques = todayRecord.visitors.length
  }

  // Clean up older daily records (keep last 60 days)
  const allDays = Object.keys(data.daily).sort()
  if (allDays.length > 60) {
    const toRemove = allDays.slice(0, allDays.length - 60)
    for (const oldDay of toRemove) {
      delete data.daily[oldDay]
    }
  }

  // 4. Update real-time active visitors (last 5 minutes)
  if (!data.activeVisitors) data.activeVisitors = {}
  data.activeVisitors[visitorHash] = now

  // Remove active visitor entries older than 5 minutes
  const fiveMinutesAgo = now - 5 * 60 * 1000
  for (const [hash, timestamp] of Object.entries(data.activeVisitors)) {
    if (timestamp < fiveMinutesAgo) {
      delete data.activeVisitors[hash]
    }
  }

  // 5. Track specific event views
  if (eventId) {
    if (!data.eventViews) data.eventViews = {}
    data.eventViews[eventId] = (data.eventViews[eventId] || 0) + 1
  }

  scheduleSave()
  return { success: true }
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const data = await loadAnalyticsFromDisk()
  const now = Date.now()
  const today = getTodayString()

  // Clean & count active visitors in the last 5 minutes
  const fiveMinutesAgo = now - 5 * 60 * 1000
  let liveActive = 0
  if (data.activeVisitors) {
    for (const [hash, timestamp] of Object.entries(data.activeVisitors)) {
      if (timestamp >= fiveMinutesAgo) {
        liveActive++
      } else {
        delete data.activeVisitors[hash]
      }
    }
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
