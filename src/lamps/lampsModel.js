const Sequelize = require('sequelize')
// DB Connection
const sequelize = require('../../models/lamp.js')
// import place_id foreign key
const Places = require('../lampPlaces/placesModel.js')

const Lamps = sequelize.define('lamps', {
  lamp_id: {
    type: Sequelize.STRING(25),
    allowNull: false,
    primaryKey: true
  },
  lamp_hash_id: {
    type: Sequelize.STRING(50),
    allowNull: false
  },
  lamp_location: {
    type: Sequelize.ARRAY(Sequelize.DOUBLE), // Sequelize.GEOMETRY('POINT'),
    allowNull: false
  },
  lamp_deployed_date: {
    type: Sequelize.DATEONLY,
    allowNull: true,
    defaultValue: null
  },
  lamp_wifi_ssid: {
    type: Sequelize.STRING(25),
    allowNull: true,
    defaultValue: null
  },
  lamp_wifi_password: {
    type: Sequelize.STRING(25),
    allowNull: true,
    defaultValue: null
  },
  place_id: {
    type: Sequelize.INTEGER,
    references: {
      model: Places,
      key: 'place_id',
      deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
    }
  }
}, {
  indexes: [
    {
      name: 'places_index',
      unique: false,
      method: 'BTREE',
      fields: ['place_id']
    }
  ],
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})

module.exports = Lamps
