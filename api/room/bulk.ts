import { NowRequest, NowResponse } from '@now/node'
import Joi from '@hapi/joi'
import startOfDay from 'date-fns/startOfDay'
import isEmpty from 'lodash/isEmpty'
import validate from '../validate'
import server from '../server'
import { Availability } from '@hotel/models/availability'
import { checkRoom, validateAvailability, getDates } from '../utils';
import { createError } from 'micro';
import { CustomPricing } from '@hotel/models/custom-pricing';

const schema = Joi.object().keys({
  // TODO timezones
  dates: Joi.array().items(Joi.date().min(startOfDay(new Date())).required()).required(), // TODO: Timezone check
  availability: Joi.number().min(0),
  price: Joi.number().min(0),
})

const querySchema = Joi.object().keys({
  id: Joi.string().required(),
})

interface Body {
  dates: Array<Date>
  availability?: number
  price?: number
}

interface Query {
  id: string
}

interface Update {
  available?: number
  price?: import('@hotel/models/types').Money
}


// TODO; do not allow adding new on same day
export default server(async (req: NowRequest, res: NowResponse) => {
  const { dates, availability, price }: Body = validate(req.body, schema)
  const { id }: Query = validate(req.query, querySchema)
  // Make the update object
  const update: Update = {}

  // Get the room first
  const room = await checkRoom(id)

  // Validate availability
  if(typeof availability === 'number') {
    validateAvailability({ availability, roomTotal: room.total })
    update.available = availability
  }

  if(typeof price === 'number') {
    update.price = { value: price, currency: 'MYR' }
  }
  
  // If there's no update at all, we should fail
  if(isEmpty(update)) {
    throw createError(422, JSON.stringify({
      error: 'At least one of the updates should be provided: availablity or price'
    }))
  }

  const search = { room: room._id, date: { $in: dates } }

  // Availability
  // Update existing
  await Availability.updateMany(
    search, 
    { $set: { available: update.available, room: room._id,  } },
    { new: true, multi: true }
  )
  // Create non-existent
  const existentAvailabilities = await Availability.find(search)
  const eaDates = getDates(existentAvailabilities)
  await Availability.create(
    dates
      .filter((date) => eaDates.indexOf(date.toISOString()) === -1)
      .map((date) => ({
        available: update.available,
        room: room._id,
        date
      }))
  )

  // Availability
  // Update existing
  await CustomPricing.updateMany(
    { room: room._id, date: { $in: dates } }, 
    { $set: { price: update.price } },
    { new: true, multi: true }
  )
  // Create non-existent
  const existentCustoms = await CustomPricing.find(search)
  const ecDates = getDates(existentCustoms)

  await CustomPricing.create(
    dates
      .filter((date: Date) => ecDates.indexOf(date.toISOString()) === -1)
      .map((date) => ({
        price: update.price,
        room: room._id,
        date
      }))
  )

  // TODO return updated and new counts
  return {
    payload: {},
    meta: {
      success: true
    }
  }
})