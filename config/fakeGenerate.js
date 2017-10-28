global.CONFIG = require('../config/lampProdConfig.js')

const CONFIG = global.CONFIG

global.SEQUELIZE = require('../connection/lampsConnect.js')

const Events = require('./fakeData.json')

// import Models
const Models = require('../src')


const DataImport = async () => {
  try {

    // await Models.apisModel.Lamps.create({
    //   lamp_id: '171028-1',
    //   lamp_hash_id: '9b38140545329e2382c85216f267c9fe06db08232b1b14d2997004d2b25',
    //   lamp_location: [120.19151248216, 22.9997144678771],
    //   place_id: 1
    // })

    // await Models.apisModel.Lamps.create({
    //   lamp_id: '171028-2',
    //   lamp_hash_id: '74730ce5746494b0cd0b6665fa869d660ffbbec1eba220b342add3',
    //   lamp_location: [120.193272644465, 22.9963046536379],
    //   place_id: 1
    // })

    // await Models.apisModel.Lamps.create({
    //   lamp_id: '171028-3',
    //   lamp_hash_id: '764730ce5746494b0cd0b6665fa869d660ffbbec1eba220b342adaed3',
    //   lamp_location: [120.193272644465, 22.9963046536379],
    //   place_id: 1
    // })

    await Events
    .lamps
    .forEach((event) => {
      Models.apisModel.Counts.create({lamp_id: event.id, counts: event.counts, created_at: event.created_at})
    })

    console.log(`\n\n ${CONFIG['database']} Import Data success \n\n`)
  } catch (error) {
    console.log('DATA: ', error)
  }
}

const initialize = async () => {
  await DataImport()
}

initialize()