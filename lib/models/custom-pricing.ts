import mongooseConnect, { Schema, Document } from '@hotel/mongoose'
import moneySchema from './schemas/money'
import { ICustomPricing } from './types'

const mongoose = mongooseConnect()

export interface CustomPricing extends Document, ICustomPricing {}

const CustomPricingSchema: Schema = new Schema({
  date: { type: Date, required: true },
  price: { type: moneySchema, required: true },
  room: { 
    type: Schema.Types.ObjectId, 
    ref: 'Room',
    required: true,
    index: true
  },
})
CustomPricingSchema.index({ date: 1, room: 1 }, { unique: true })

export const CustomPricing = mongoose.model<CustomPricing>('CustomPricing', CustomPricingSchema)
