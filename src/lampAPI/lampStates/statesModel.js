const Sequelize = require('sequelize')
// import lamp_id foreign key
const Lamps = require('../lamps/lampsModel.js')

const States = global.SEQUELIZE.define('lamp_states', {
  state_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  lamp_id: {
    type: Sequelize.STRING(25),
    references: {
      model: Lamps,
      key: 'lamp_id',
      deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
    }
  },
  lamp_state: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  lamp_check_date: {
    type: Sequelize.DATEONLY,
    allowNull: true,
    defaultValue: null
  },
  lamp_check_person: {
    type: Sequelize.STRING(10),
    allowNull: true,
    defaultValue: null
  },
  state_description: {
    type: Sequelize.TEXT,
    allowNull: true,
    defaultValue: null
  },
  state_reason: {
    type: Sequelize.TEXT,
    allowNull: true,
    defaultValue: null
  }
}, {
  indexes: [
    {
      name: 'states_lamp_id_index',
      unique: false,
      method: 'BTREE',
      fields: ['lamp_id']
    },
    {
      name: 'states_lamp_state_index',
      unique: false,
      method: 'BTREE',
      fields: ['lamp_state']
    }
  ],
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})

module.exports = States
