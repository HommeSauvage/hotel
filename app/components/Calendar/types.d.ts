import { IRoom } from '@hotel/models/types'

export interface ReservationCount {
  date: Date,
  count: number
}

export interface PriceDate {
  date: Date,
  price: Price
}

export interface CalendarInterface {
  reservations: ReservationCount[],
  prices: PriceDate[],
}

export interface DateUpdate {
  date: Date
  value: any
}