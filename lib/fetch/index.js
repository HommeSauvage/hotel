const fetch = require('isomorphic-unfetch')

/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON from the request
 */
function parseJSON(response) {
  return response.json()
}

/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {object} response   A response from a network request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  }

  const error = new Error(response.statusText)
  error.raw = response
  throw error
}

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 *
 * @return {object}           The response data
 */
module.exports = async (url, options = {}) => {
  const headers = options.headers || {}

  headers['Content-Type'] = 'application/json'
  headers.Accept = 'application/json'

  const opts = {
    headers,
    ...options,
  }

  let response
  try {
    const response = await fetch(url, opts)  
    checkStatus(response)
    return parseJSON(response)

  } catch (error) {
    let parsed

    try {
      parsed = await parseJSON(error.raw)
    } catch (parseError) {
      parsed = { error: 'unknown_response' }
    } finally {
      error.response = parsed
      throw error
    }

  }
  
}
