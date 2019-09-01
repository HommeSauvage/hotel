import mongoose = require('mongoose')
import normalizeJson from './plugins/normalize-json'

export * from 'mongoose'

mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false)
mongoose.plugin(normalizeJson)

const mongoUrl = process.env.MONGO_URL

// Prevent mongoose from connecting too many times
let connected = false
let trying = false

export default (url?: string) => {
  const finalUrl = url || mongoUrl

  if (!finalUrl) {
    throw new Error("Missing Mongo URL")
  }
  
  if(trying) {
    return mongoose
  }

  trying = true

  if(connected) {
    return mongoose
  }

  mongoose.connect(finalUrl, { useNewUrlParser: true })
  
  const db = mongoose.connection
  
  db.on('connected', () => {
    connected = true
  })

  db.on('error', (err) => {
    connected = false
    console.error('MongoDB connection error:', err)
  })
  
  return mongoose
}