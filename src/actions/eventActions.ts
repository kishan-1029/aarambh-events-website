'use server'

import fs from 'fs/promises'
import path from 'path'

export type EventDate = {
  id: string
  date: string
  price: number
}

export type Event = {
  id: string
  name: string
  venue: string
  poster: string
  onlinePrice: number
  dates: EventDate[]
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
  
  // ensure date ids
  newEvent.dates = newEvent.dates.map(d => ({ ...d, id: d.id || `date-${Date.now()}-${Math.random()}` }))
  
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
  
  updatedEvent.dates = updatedEvent.dates.map(d => ({ ...d, id: d.id || `date-${Date.now()}-${Math.random()}` }))
  
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
