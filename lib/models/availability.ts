import mongooseConnect, { Schema, Document } from '@hotel/mongoose'
import { IAvailability } from './types'

const mongoose = mongooseConnect()

export interface Availability extends Document, IAvailability {}

const AvailabilitySchema: Schema = new Schema({
  date: { type: Date, required: true },
  available: { type: Number, required: true },
  room: { 
    type: Schema.Types.ObjectId, 
    ref: 'Room',
    required: true,
    index: true
  },
})

AvailabilitySchema.index({ date: 1, room: 1 }, { unique: true })

export const Availability = mongoose.model<Availability>('Availability', AvailabilitySchema)
