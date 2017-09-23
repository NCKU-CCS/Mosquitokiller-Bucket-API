const Sequelize = require('sequelize')
const sequelize = require('../../models/lamp.js')

const Rules = sequelize.define('lamp_mcc_rules', {
  rule_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  timeline_upper_limit: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  distance_lower_limit: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  points_lower_limit: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  counts_lower_limit: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})

module.exports = Rules
