import Joi, { Schema, ValidationOptions, ValidationError } from '@hapi/joi'
import groupBy from 'lodash/groupBy'
import mapValues from 'lodash/mapValues'
import map from 'lodash/map'
import { createError } from 'micro'

export type Errors = {
  [field: string]: Array<string>
}

const format = (errors: ValidationError): Errors => mapValues(groupBy(errors.details, (error) => error.path[0]), (e) => map(e, 'message'))

export default (data: any, schema: Schema, options: ValidationOptions = {}) => {
  if(!schema) {
    throw new Error('No validation schema provided')
  }
  const { value, error } = Joi.validate(data, schema, {
    abortEarly: false,
    ...options
  });

  if(error) {
    throw createError(422, JSON.stringify({
      errors: format(error)
    }))
  }

  return value
}
