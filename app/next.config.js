if (process.env.NODE_ENV !== 'production') {
  const readEnv = require('../internals/read-env')
  const { join } = require('path')
  readEnv(join(__dirname, '../.env'), true)
}

module.exports = {
  target: 'serverless',
  env: {
    APP_URL: process.env.APP_URL,
  }
}