import mongooseConnect, { Schema, Document } from '@hotel/mongoose'
import moneySchema from './schemas/money'
import { IRoom } from './types'

const mongoose = mongooseConnect()

// Pricing rules
// Priority should be to custom, then fallback to days, then default
// this is in the same file because it's closely tied to the RoomSchema
const pricingSchema: Schema = new Schema({
  // Default price to use in case of no custom pricing
  default: { type: moneySchema, required: true },

  // Weekdays pricing
  weekdays: {
    monday: { type: moneySchema },
    tuesday: { type: moneySchema },
    wednesday: { type: moneySchema },
    thursday: { type: moneySchema },
    friday: { type: moneySchema },
    saturday: { type: moneySchema },
    sunday: { type: moneySchema },
  },
})



export interface Room extends Document, IRoom {}

const RoomSchema: Schema = new Schema({
  name: { type: String, required: true },
  total: { type: Number, required: true, min: 0, },
  pricing: { type: pricingSchema, required: true },
}, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
})

RoomSchema.virtual('customPricing', {
  ref: 'CustomPricing', // The model to use
  localField: '_id', // Find maintenance where `localField`
  foreignField: 'room', // is equal to `foreignField`
  options: { sort: { date: 1 } } // Query options, see http://bit.ly/mongoose-query-options
})

RoomSchema.virtual('availability', {
  ref: 'Availability', // The model to use
  localField: '_id', // Find maintenance where `localField`
  foreignField: 'room', // is equal to `foreignField`
  options: { sort: { date: 1 } } // Query options, see http://bit.ly/mongoose-query-options
})

export const Room = mongoose.model<Room>('Room', RoomSchema)
