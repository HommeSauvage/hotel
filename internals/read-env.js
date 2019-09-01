/**
 * Read env from a .env file and make them available in process.env
 * @param  {string} path  
 * @param  {bool} force Do we force the .env file over the available env variables?
 * @return void
 */
module.exports = (path, force) => {
  const { readFileSync } = require('fs')
  const envConfig = require('dotenv').parse(readFileSync(path))
  for (let k in envConfig) {
    if(!process.env[k] || force) {
      process.env[k] = envConfig[k]
    }
  }
}