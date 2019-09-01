import { NowRequest, NowResponse } from '@now/node'
import Joi from '@hapi/joi'
import validate from '../validate'
import server from '../server'
import { CustomPricing } from '@hotel/models/custom-pricing'
import { checkRoom } from '../utils';

const schema = Joi.object().keys({
  date: Joi.date().min(new Date()).required(), // TODO: Timezone check
  price: Joi.number().min(0).required()
})

const querySchema = Joi.object().keys({
  roomId: Joi.string().required(),
})

interface Body {
  date: Date
  price: number
}

interface Query {
  roomId: string
}

// TODO; do not allow adding new on same day
export default server(async (req: NowRequest, res: NowResponse) => {
  const { date, price }: Body = validate(req.body, schema)
  const { roomId }: Query = validate(req.query, querySchema)

  // Check if there are rooms available
  await checkRoom(roomId)

  // Search for the custom pricing on the day
  const pricing = await CustomPricing.findOneAndUpdate(
    { date, room: roomId }, 
    { $set: { price: { value: price, currency: 'MYR'}, date, room: roomId } },
    { upsert: true, new: true }
  )

  return pricing
})