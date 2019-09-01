export interface Money {
  value: number
  currency: string
}

export interface Pricing {
  default: Money
  weekdays: {
    monday?: Money
    tuesday?: Money
    wednesday?: Money
    thursday?: Money
    friday?: Money
    saturday?: Money
    sunday?: Money
  }
}

export interface ICustomPricing {
  date: Date | string
  price: Money
  room: any
}

export interface IAvailability {
  date: Date | string
  available: number
  room: any
}

export interface IRoom {
  _id: any,
  name: string
  total: number
  pricing: Pricing,
  customPricing?: Array<ICustomPricing> | undefined
  availability?: Array<IAvailability> | undefined
}
