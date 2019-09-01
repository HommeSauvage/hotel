import { Room } from '@hotel/models/room'

const money = (value: number) => ({
  value,
  currency: 'MYR'
})

const generate = () => {
  return [
    {
      name: 'Single Room',
      total: 5,
      pricing: {
        default: money(200),
        weekdays: {},
      }
    },
    {
      name: 'Double Room',
      total: 5,
      pricing: {
        default: money(280),
        weekdays: {},
      }
    }
  ]
}

export default async (): Promise<Array<Room>> => {
  await Room.deleteMany({})
  return await Room.insertMany(generate())
}