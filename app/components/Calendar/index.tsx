import { useState, useEffect } from 'react'
import fetch from '@stillthere/fetch'
import qs from 'qs'
import CalendarView from './Calendar'
import config from '../../config'
import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';
import { toast } from 'react-toastify';

type IRoom = import('@hotel/models/types').IRoom
type ICustomPricing = import('@hotel/models/types').ICustomPricing
type IAvailability = import('@hotel/models/types').IAvailability

export type Props = {
  preloadedRooms?: Array<IRoom>,
  preloadedAround: Date
}

const Calendar = ({ preloadedRooms, preloadedAround = new Date() }: Props) => {
  /* State ------------------------------------------------------------- */
  const [rooms, setRooms] = useState<Array<IRoom>>(preloadedRooms || [])
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [around, setAround] = useState<Date>(preloadedAround || startOfMonth(new Date()))

  /* Handlers  ---------------------------------------------------------- */
  const loadRooms = async () => {
    try {
      const query = qs.stringify({
        calendar: 'true',
        from: startOfMonth(around),
        to: endOfMonth(around),
      })
      const { payload: rooms } = await fetch(`${config.apiUrl}/rooms?${query}`)
      setRooms(rooms || [])
    } catch (e) {
      toast.error('Whoops, something wrong happened')
      // 
    }
  }

  const savePrice = async (roomId: string, { date, value }: import('./types').DateUpdate, callback?: () => void) => {
    try {
      setIsSaving(true)
      const custom: ICustomPricing = await fetch(`${config.apiUrl}/room/${roomId}/price`, {
        method: 'PUT',
        body: JSON.stringify({
          date,
          price: value
        })
      })

      // TODO update rather than just prepend
      setRooms(rooms.map((room: IRoom): IRoom => {
        if(room._id === custom.room) {
          return { 
            ...room, 
            customPricing: [
              custom,
              ...(room.customPricing || []),
            ] 
          }
        }
        return room
      }))
      
      if(callback) {
        callback()
      }
    } catch (e) {
      console.error(e)
      toast.error('Unable to update the room')
    } finally {
      setIsSaving(false)
    }
  }

  const saveAvailability = async (roomId: string, { date, value }: import('./types').DateUpdate, callback?: () => void) => {
    try {
      setIsSaving(true)
      const newAvailability: IAvailability = await fetch(`${config.apiUrl}/room/${roomId}/availability`, {
        method: 'PUT',
        body: JSON.stringify({
          date,
          availability: value
        })
      })
      // TODO update rather than just prepend
      setRooms(rooms.map((room: IRoom): IRoom => {
        if(room._id === newAvailability.room) {
          return { 
            ...room, 
            availability: [
              newAvailability,
              ...(room.availability || []),
            ] 
          }
        }
        return room
      }))
      if(callback) {
        callback()
      }
    } catch (e) {
      toast.error('Unable to update the room')
    } finally {
      setIsSaving(false)
    }
  }

  /* Effects  ---------------------------------------------------------- */
  useEffect(() => {
    if(!rooms.length) {
      loadRooms()
    }
  }, [])

  /* Rendering ---------------------------------------------------------- */
  return (
    <CalendarView
      actionsDisabled={isSaving}
      rooms={rooms} 
      around={around} 
      onChangedPrice={savePrice}
      onChangedAvailability={saveAvailability}
      onChangeAround={setAround} />
  )
}

export default Calendar
