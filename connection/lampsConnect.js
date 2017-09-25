const Sequelize = require('sequelize')

const CONFIG = (process.env.NODE_ENV === 'production')
  ? require('../config/lampProdConfig.js')
  : require('../config/lampDevConfig.js')

// Setup Sequelize
const sequelize = new Sequelize(CONFIG['database'], CONFIG['user'], CONFIG['password'], {
  host: 'localhost',
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    idle: 1000
  }
})

sequelize
  .authenticate()
  .then(() => {
    console.log(`${CONFIG['database']} Connection has been established successfully.`)
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err)
  })

module.exports = sequelize
