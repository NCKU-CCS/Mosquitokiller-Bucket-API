global.CONFIG = require('../config/lampProdConfig.js')

const CONFIG = global.CONFIG

global.SEQUELIZE = require('../connection/lampsConnect.js')

const Events = require('./fakeData.json')

// import Models
const Models = require('../src')


const DataImport = async () => {
  try {
    // for (let i = 1; i<=50; j++) {
    //   await Models.apisModel.Lamps.create({
    //     lamp_id: `171028-${i}`,
    //     lamp_hash_id: '9b38140545329e2382c85216f267c9fe06db08232b1b14d2997004d2b25',
    //     lamp_location: [120.19151248216, 22.9997144678771],
    //     place_id: 1
    //   })
    // }
    // await Events
    // .lamps
    // .forEach((event) => {
    //   Models.apisModel.Counts.create({lamp_id: event.id, counts: event.counts, created_at: event.created_at})
    // })
    const created_at = '2017-11-01T10:38:56.124Z'
    for (let i = 1; i <= 10; i+=5) {
      for (let j = 1; j <= 9; j++) {
        await Models.apisModel.Counts.create({lamp_id: `171028-${i}`, counts: 1, created_at: created_at})
        await Models.apisModel.Counts.create({lamp_id: `171028-${i+1}`, counts: 1, created_at: created_at})
      }
      console.log('finish: 9')
      for (let j = 1; j <= 40; j++) {
        await Models.apisModel.Counts.create({lamp_id: `171028-${i+2}`, counts: 1, created_at: created_at})
      }
      console.log('finish: 40')
      for (let j = 1; j <= 60; j++) {
        await Models.apisModel.Counts.create({lamp_id: `171028-${i+3}`, counts: 1, created_at: created_at})
      }
      console.log('finish: 60')
      for (let j = 1; j <= 110; j++) {
        await Models.apisModel.Counts.create({lamp_id: `171028-${i+4}`, counts: 1, created_at: created_at})
      }
      console.log('finish: 110')
    }
    console.log(`\n\n ${CONFIG['database']} Import Data success \n\n`)
  } catch (error) {
    console.log('DATA: ', error)
  }
}

const insertFakeData = async () => {
  await DataImport()
}

insertFakeData()