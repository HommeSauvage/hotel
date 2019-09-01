import mongooseConnect, { Schema, Document } from '@hotel/mongoose'
import moneySchema from './schemas/money'
import { IReservation } from './types'

const mongoose = mongooseConnect()

export const types = ['online', 'walk-in', 'admin']

export interface Reservation extends Document, IReservation {

}

const ReservationSchema: Schema = new Schema({
  client: { type: String }, // example only
  type: { type: String, enum: [], required: true },
  from: { type: Date, required: true, index: true },
  to: { type: Date, required: true, index: true },
  price: { type: moneySchema, required: true },
  room: {
    type: Schema.Types.ObjectId,
    ref: 'Room', 
    required: true,
  }
}, {
  timestamps: true,
})

export const Reservation = mongoose.model<Reservation>('Reservation', ReservationSchema)
