import { getEventById } from '@/actions/eventActions'
import { notFound } from 'next/navigation'
import MobileBookingClient from './MobileBookingClient'
import RouteScrollTop from '@/components/RouteScrollTop'

export const revalidate = 0

export default async function MobileBookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ date?: string }>
}) {
  const { id } = await params
  const { date } = await searchParams

  const event = await getEventById(id)
  if (!event) {
    notFound()
  }

  // Determine actual date & verified price from event data - never trust client params for price
  const datesList = (event.categoryCount && event.categoryCount > 1 && event.categories && event.categories.length > 0)
    ? event.categories[0].dates
    : (event.dates || [])
  const selectedDateObj = datesList.find(d => d.date === date || d.id === date) || datesList[0]

  if (!selectedDateObj) {
    notFound()
  }

  return (
    <>
      <RouteScrollTop />
      <MobileBookingClient 
        event={event} 
        selectedDate={selectedDateObj} 
      />
    </>
  )
}
