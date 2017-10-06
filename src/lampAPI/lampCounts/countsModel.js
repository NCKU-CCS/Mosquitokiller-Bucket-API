const Sequelize = require('sequelize')
// import lamp_id foreign key
const Lamps = require('../lamps/lampsModel')

const Counts = global.SEQUELIZE.define('lamp_counts', {
  count_id: {
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
  counts: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
}, {
  indexes: [
    {
      name: 'counts_lamp_id_index',
      unique: false,
      method: 'BTREE',
      fields: ['lamp_id']
    },
    {
      name: 'counts_created_at_index',
      unique: false,
      method: 'BTREE',
      fields: ['created_at']
    },
    {
      name: 'counts_lamp_id_created_at_index',
      unique: false,
      method: 'BTREE',
      fields: ['created_at', 'lamp_id']
    }
  ],
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
})

module.exports = Counts
