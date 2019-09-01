import { NowRequest, NowResponse } from '@now/node'
import { json, run, send, RequestHandler } from 'micro'

type serverCallback = (req: NowRequest, res: NowResponse) => any

/**
 * Handle errors
 * @param  {function} fn) function to run
 * @return {any}     response
 */
// @ts-ignore
const handleErrors = (fn: serverCallback): RequestHandler => async (req: NowRequest, res: NowResponse) => {
  try {
    return await fn(req, res)
  } catch (err) {

    const statusCode = err.statusCode || err.status;
    const message = statusCode ? err.message : 'Internal Server Error';

    send(
      res, 
      statusCode || 500, 
      typeof message === 'string' ? message : JSON.stringify(message)
    );

    if (err instanceof Error) {
      console.error(err.stack);
    } else {
      console.warn('thrown error must be an instance of Error');
    }
  }
}

// Exporting a wrapper around a what we will server
export default (fn: serverCallback) => 
  (req: NowRequest, res: NowResponse) => 
    run(req, res, handleErrors(
      async (req: NowRequest, res: NowResponse) => {
        const requiresBody = ['POST', 'PUT', 'PATCH']
        req.body = await ((req.method && requiresBody.indexOf(req.method)) !== -1 ? json(req) : Promise.resolve())

        return await fn(req, res)
      })
    )