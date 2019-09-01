import { NowRequest, NowResponse } from '@now/node'
import Joi from '@hapi/joi'
import validate from '../validate'
import server from '../server'
import '@hotel/models/custom-pricing'
import '@hotel/models/availability'
import { Room } from '@hotel/models/room'

const schema = Joi.object().keys({
  calendar: Joi.boolean(),
  from: Joi.date().when('calendar', { is: true, then: Joi.required(), otherwise: Joi.optional() }),
  to: Joi.date().greater(Joi.ref('from')).when('calendar', { is: true, then: Joi.required(), otherwise: Joi.optional() }),
 })


interface Query {
  from: Date
  to: Date
  calendar: boolean
}

export default server(async (req: NowRequest, res: NowResponse) => {
  const { from, to, calendar }: Query = validate(req.query, schema)

  // Get all rooms and stitch the reservations
  const query = Room.find({})

  // Calendar view
  if(calendar) {
    query.populate({
        path: 'customPricing',
        match: { 
          $and: [
            { date: { $gte: from } },
            { date: { $lte: to } },
          ]
        }
      })
      .populate({
        path: 'availability',
        match: { 
          $and: [
            { date: { $gte: from } },
            { date: { $lte: to } },
          ]
        }
      })
  }
    
  
  const rooms = await query.exec()

  return {
    payload: rooms,
    meta: {}
  }
})