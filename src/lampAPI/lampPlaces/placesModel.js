const Sequelize = require('sequelize')

const Places = global.SEQUELIZE.define('lamp_places', {
  place_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  place_name: {
    type: Sequelize.STRING(25),
    allowNull: false
  },
  place_address: {
    type: Sequelize.STRING(50),
    allowNull: false
  },
  place_contact_person: {
    type: Sequelize.STRING(10),
    allowNull: true,
    defaultValue: null
  },
  place_phone: {
    type: Sequelize.STRING(25),
    allowNull: true,
    defaultValue: null
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})

module.exports = Places
