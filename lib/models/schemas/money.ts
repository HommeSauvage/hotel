import mongoose from 'mongoose'

export default new mongoose.Schema({
  value: { type: Number, required: true },
  currency: { type: String, required: true }
})