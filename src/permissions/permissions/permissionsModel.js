const Sequelize = require('sequelize')

const Permissions = global.SEQUELIZE.define('permissions', {
  permission_id: {
    type: Sequelize.STRING(25),
    allowNull: false,
    primaryKey: true
  },
  permission_description: {
    type: Sequelize.TEXT,
    allowNull: false
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})

module.exports = Permissions
