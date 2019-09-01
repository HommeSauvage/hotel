import { Model } from 'mongoose'

const removeVersion = (ret: any) => {
  if (typeof ret.__v !== 'undefined') {
    delete ret.__v
  }
}

export default function(schema: any) {
  //NOTE: this plugin is actually called *after* any schema's
  //custom toJSON has been defined, so we need to ensure not to
  //overwrite it. Hence, we remember it here and call it later
  let transform: any;
  if (schema.options.toJSON && schema.options.toJSON.transform) {
    transform = schema.options.toJSON.transform;
  }

  //Extend toJSON options
  schema.options.toJSON = {
    ...(schema.options.toJSON || {}),
    transform(doc: Model<any>, ret: any, options: any) {

      //Remove version
      if (schema.options.removeVersion !== false) {
        removeVersion(ret);
      }

      //Call custom transform if present
      if (transform) {
        return transform(doc, ret, options);
      }
    },
  }
}