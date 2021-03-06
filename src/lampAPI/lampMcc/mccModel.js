const Sequelize = require('sequelize')
const Rules = require('../lampMccRules/rulesModel')

const Mcc = global.SEQUELIZE.define('lamp_mcc', {
  mcc_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  mcc_keys: {
    type: Sequelize.ARRAY(Sequelize.STRING(25)),
    allowNull: false
  },
  mcc_points: {
    type: Sequelize.ARRAY(Sequelize.STRING(25)),
    allowNull: false
  },
  mcc_center: {
    type: Sequelize.ARRAY(Sequelize.DOUBLE),
    allowNull: false
  },
  rule_id: {
    type: Sequelize.INTEGER,
    references: {
      model: Rules,
      key: 'rule_id',
      deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
    }
  }
}, {
  indexes: [
    {
      name: 'mcc_created_at_index',
      unique: false,
      method: 'BTREE',
      fields: ['created_at']
    }
  ],
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
})

module.exports = Mcc
