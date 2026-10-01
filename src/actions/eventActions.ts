'use server'

import fs from 'fs/promises'
import path from 'path'

export type EventDate = {
  id?: string
  date: string
  purchasingPrice?: string | number
  commission?: string | number
  price: number | string
}

export type EventCategory = {
  id: string
  name: string
  dates: EventDate[]
}

export type Event = {
  id: string
  name: string
  venue: string
  poster: string
  onlinePrice: number
  categoryCount?: number
  categories?: EventCategory[]
  dates?: EventDate[]
  createdAt: string
  updatedAt: string
}

const dataPath = path.join(process.cwd(), 'src/data/events.json')

export async function getEvents(): Promise<Event[]> {
  try {
    const data = await fs.readFile(dataPath, 'utf-8')
    return JSON.parse(data) as Event[]
  } catch (error) {
    console.error('Failed to read events', error)
    return []
  }
}

export async function getEventById(id: string): Promise<Event | null> {
  const events = await getEvents()
  return events.find(e => e.id === id) || null
}

export async function addEvent(eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) {
  const events = await getEvents()
  const newEvent: Event = {
    ...eventData,
    id: `event-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  if (newEvent.categoryCount && newEvent.categoryCount > 1) {
    delete newEvent.dates
    if (newEvent.categories) {
      newEvent.categories = newEvent.categories.map(c => ({
        ...c,
        dates: c.dates.map(d => ({ ...d }))
      }))
    }
  } else {
    delete newEvent.categories
    if (newEvent.dates) {
      newEvent.dates = newEvent.dates.map(d => ({ ...d }))
    }
  }
  
  events.push(newEvent)
  await fs.writeFile(dataPath, JSON.stringify(events, null, 2))
  return newEvent
}

export async function updateEvent(id: string, eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) {
  const events = await getEvents()
  const index = events.findIndex(e => e.id === id)
  if (index === -1) throw new Error('Event not found')
  
  const updatedEvent: Event = {
    ...events[index],
    ...eventData,
    updatedAt: new Date().toISOString()
  }
  
  if (updatedEvent.categoryCount && updatedEvent.categoryCount > 1) {
    delete updatedEvent.dates
    if (updatedEvent.categories) {
      updatedEvent.categories = updatedEvent.categories.map(c => ({
        ...c,
        dates: c.dates.map(d => ({ ...d }))
      }))
    }
  } else {
    delete updatedEvent.categories
    if (updatedEvent.dates) {
      updatedEvent.dates = updatedEvent.dates.map(d => ({ ...d }))
    }
  }
  
  events[index] = updatedEvent
  await fs.writeFile(dataPath, JSON.stringify(events, null, 2))
  return updatedEvent
}

export async function deleteEvent(id: string) {
  const events = await getEvents()
  const filtered = events.filter(e => e.id !== id)
  await fs.writeFile(dataPath, JSON.stringify(filtered, null, 2))
  return true
}
