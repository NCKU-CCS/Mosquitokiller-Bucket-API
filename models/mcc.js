const Sequelize = require('sequelize')
const CONFIG = require('../config/config.js')

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
      console.log('Connection has been established successfully.')
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err)
    })

module.exports = sequelize
