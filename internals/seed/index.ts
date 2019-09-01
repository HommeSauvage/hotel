// Read the env variables
const { join } = require('path')
require('../read-env')(join(__dirname, '../../.env'))


import seedRooms  from './seed-rooms'
import seedAvailability from './seed-availability'
import seedCustomPricing from './seed-custom-prices'

const seed = async () => {
  console.log('Starting seeding...')

  try {
    console.log('Seeding rooms...')
    const rooms = await seedRooms()

    console.log('Seeding availablity...')
    await seedAvailability({ rooms })

    console.log('Seeding prices...')
    await seedCustomPricing({ rooms })

  } catch (e) {
    console.error(e)
  }

  console.log('Done seeding.')
  process.exit()
}

// Bootstrap
seed()