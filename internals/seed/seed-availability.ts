import { Availability } from '@hotel/models/availability'
import { Room } from '@hotel/models/room'
import faker from 'faker'
import sample from 'lodash/sample'
import random from 'lodash/random'
import startOfMonth from 'date-fns/startOfMonth'
import startOfDay from 'date-fns/startOfDay'
import endOfMonth from 'date-fns/endOfMonth'
import { IAvailability } from '@hotel/models/types';

interface ContainsRooms {
  rooms: Array<Room>
}

const generate = ({ rooms }: ContainsRooms) => {
  return Array(6).fill(null).map((): IAvailability => {
    const date = startOfDay(faker.date.between(startOfMonth(new Date()), endOfMonth(new Date())))
    const room = sample(rooms)
    return {
      date,
      available: random(0, room ? room.total : 5),
      room: room ? room._id : null
    }
  })
}

export default async ({ rooms }: ContainsRooms): Promise<Array<Availability>> => {
  await Availability.deleteMany({})
  return await Availability.insertMany(generate({ rooms }))
}