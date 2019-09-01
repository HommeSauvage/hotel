import { NowRequest, NowResponse } from '@now/node'
import Joi from '@hapi/joi'
import validate from '../validate'
import server from '../server'
import { Availability } from '@hotel/models/availability'
import { createError } from 'micro';
import { checkRoom, validateAvailability } from '../utils';

const schema = Joi.object().keys({
  date: Joi.date().min(new Date()).required(), // TODO: Timezone check
  availability: Joi.number().min(0).required()
})

const querySchema = Joi.object().keys({
  roomId: Joi.string().required(),
})

interface Body {
  date: Date
  availability: number
}

interface Query {
  roomId: string
}

// TODO; do not allow adding new on same day
export default server(async (req: NowRequest, res: NowResponse) => {
  const { date, availability }: Body = validate(req.body, schema)
  const { roomId }: Query = validate(req.query, querySchema)

  // Check if there are rooms available
  const room = await checkRoom(roomId)

  // Validate availablity
  validateAvailability({ availability, roomTotal: room.total })

  // Search for the custom pricing on the day
  const pricing = await Availability.findOneAndUpdate(
    { date, room }, 
    { $set: { available: availability, date, room } },
    { upsert: true, new: true }
  )

  return pricing
})