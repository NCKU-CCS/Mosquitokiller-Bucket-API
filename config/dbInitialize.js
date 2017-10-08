// Setup DB Connection Global Variable
global.CONFIG = (process.env.RESET_PROD_DB === 'TRUE')
  ? require('../config/lampProdConfig.js')
  : require('../config/lampDevConfig.js')

const CONFIG = global.CONFIG

global.SEQUELIZE = require('../connection/lampsConnect.js')

// import Models
const Models = require('../src')
// for crypt default user password
const bcrypt = require('bcrypt-nodejs')

// use force_remove = true only in dev db
// default force_remove = false in prod db
const FORCE_REMOVE = CONFIG['force']

const DBInitialize = async (tables) => {
  try {
    for (let table of tables) {
      await table.sync(FORCE_REMOVE)
    }
    console.log(`\n\n ${CONFIG['database']} Initialize success \n\n`)
  } catch (error) {
    console.log(`DB Initialize error:\n${error}`)
  }
}

const DataInitialize = async () => {
  try {
    await Models.apisModel.Places.create({
      place_name: 'Lab',
      place_address: '701台南市東區大學路1號 資訊系館 6樓 101房'
    })

    await Models.apisModel.Lamps.create({
      lamp_id: 'TEST01',
      lamp_hash_id: '9b38140545329e2382c85216f267c9fe06db08232b1b14d2997004d2b25ed606',
      lamp_location: [120.19151248216, 22.9997144678771],
      place_id: 1
    })

    await Models.apisModel.Lamps.create({
      lamp_id: 'TEST02',
      lamp_hash_id: '84730ce5746494b0cd0b6665fa869d660ffbbec1eba220b342adacbcd04bded3',
      lamp_location: [120.193272644465, 22.9963046536379],
      place_id: 1
    })

    await Models.apisModel.Counts.create({
      lamp_id: 'TEST01',
      counts: 1
    })

    await Models.apisModel.Counts.create({
      lamp_id: 'TEST02',
      counts: 1
    })

    await Models.apisModel.Rules.create({
      timeline_upper_limit: 3,
      distance_lower_limit: 500,
      points_lower_limit: 5,
      counts_lower_limit: 20
    })

    await Models.apisModel.Mcc.create({
      mcc_keys: ['TEST02', 'TEST01'],
      mcc_points: ['TEST02', 'TEST01'],
      mcc_center: [120.218587, 22.999277],
      rule_id: 1
    })
    console.log(`\n\n ${CONFIG['database']} Initialize Data success \n\n`)
  } catch (error) {
    console.log('DATA: ', error)
  }
}

const AccountInitialize = async () => {
  try {
    await Models.accountsModel.Roles.create({
      role_id: 'ADMIN',
      role_description: '除改動留言外之所有權限',
      role_permissions: JSON.stringify({
        'READ': ['Users', 'Roles', 'Places', 'Lamps', 'States', 'Counts', 'Mcc', 'Rules', 'Comments'],
        'CREATE': ['Users', 'Roles', 'Places', 'Lamps', 'States', 'Counts', 'Mcc', 'Rules', 'Comments'],
        'UPDATE': ['Users', 'Roles', 'Places', 'Lamps', 'States', 'Counts', 'Mcc', 'Rules'],
        'DELETE': ['Users', 'Roles', 'Places', 'Lamps', 'States', 'Counts', 'Mcc', 'Rules']
      })
    })
    await Models.accountsModel.Roles.create({
      role_id: 'EDITOR',
      role_description: '除使用者相關與改動留言外之所有權限',
      role_permissions: JSON.stringify({
        'READ': ['Places', 'Lamps', 'States', 'Counts', 'Mcc', 'Rules', 'Comments'],
        'CREATE': ['Places', 'Lamps', 'States', 'Counts', 'Mcc', 'Rules', 'Comments'],
        'UPDATE': ['Places', 'Lamps', 'States', 'Counts', 'Mcc', 'Rules'],
        'DELETE': ['Places', 'Lamps', 'States', 'Counts', 'Mcc', 'Rules']
      })
    })
    await Models.accountsModel.Roles.create({
      role_id: 'SUBSCRIBER',
      role_description: '僅有除留言外之基本資料閱讀權限',
      role_permissions: JSON.stringify({
        'READ': ['Places', 'Lamps', 'States', 'Counts', 'Mcc', 'Rules'],
        'CREATE': [],
        'UPDATE': [],
        'DELETE': []
      })
    })
    await Models.accountsModel.Users.create({
      user_id: 'admin',
      email: 'oceanus11034@gmail.com',
      password: bcrypt.hashSync('test11034', bcrypt.genSaltSync(8), null),
      first_name: 'Po Chun',
      last_name: 'Lu',
      phone: '0910-xxxxxx',
      mail_subscription: true,
      role_id: 'ADMIN'
    })
    console.log(`\n\n ${CONFIG['database']} Initialize Accounts success \n\n`)
  } catch (error) {
    console.log('Accounts: ', error)
  }
}

const initialize = async () => {
  // Initialize Data Tables
  const DATA_TABLES = Object.values(Models.apisModel)
  await DBInitialize(DATA_TABLES)
  await DataInitialize()

  // // Initialize Users Tables
  const USER_TABLES = Object.values(Models.accountsModel)
  await DBInitialize(USER_TABLES)
  await AccountInitialize()

  process.exit()
}

initialize()
