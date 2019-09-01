import { createError } from 'micro'
import { Room } from '@hotel/models/room'

export const checkRoom = async (roomId: string): Promise<Room> => {
  try {
    const room = await Room.findById(roomId)
    if(!room) {
      throw createError(404, JSON.stringify({ error: 'Room not found' }))
    }

    return room
  } catch (e) {
    // Probably throwing because ID was not cast
    throw createError(404, JSON.stringify({ error: 'Room not found' }))
  }
}

export type AvailabilityValidationProps = {
  availability: number
  roomTotal: number
}

export const validateAvailability = ({ availability, roomTotal }: AvailabilityValidationProps) => {
  // TODO: Document the errors format
  if(availability > roomTotal) {
    throw createError(422, JSON.stringify({ 
      errors: {
        availability: [`The room cannot have more rooms available than the total ${roomTotal}`]
      } 
    }))
  }
}

export type HasDate = {
  date: Date | string
}

export const getDates = (model: Array<HasDate>) => model.map((a) => {
  if(typeof a.date === 'object') {
    return a.date.toISOString()
  }

  return a.date
})