const Sequelize = require('sequelize')

const Roles = global.SEQUELIZE.define('roles', {
  role_id: {
    type: Sequelize.STRING(25),
    allowNull: false,
    primaryKey: true
  },
  role_description: {
    type: Sequelize.TEXT,
    allowNull: false
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})

module.exports = Roles
