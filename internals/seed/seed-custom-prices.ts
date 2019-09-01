import { CustomPricing } from '@hotel/models/custom-pricing'
import { Room } from '@hotel/models/room'
import faker from 'faker'
import sample from 'lodash/sample'
import random from 'lodash/random'
import startOfMonth from 'date-fns/startOfMonth'
import startOfDay from 'date-fns/startOfDay'
import endOfMonth from 'date-fns/endOfMonth'
import { ICustomPricing } from '@hotel/models/types';

const money = (value: number) => ({
  value,
  currency: 'MYR'
})

interface ContainsRooms {
  rooms: Array<Room>
}

const generate = ({ rooms }: ContainsRooms) => {
  return Array(6).fill(null).map((): ICustomPricing => {
    const date = startOfDay(faker.date.between(startOfMonth(new Date()), endOfMonth(new Date())))
    const room = sample(rooms)
    return {
      date,
      price: money(random(150, 350)),
      room: room ? room._id : null
    }
  })
}

export default async ({ rooms }: ContainsRooms): Promise<Array<CustomPricing>> => {
  await CustomPricing.deleteMany({})
  return await CustomPricing.insertMany(generate({ rooms }))
}