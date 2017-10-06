const Sequelize = require('sequelize')

const Users = global.SEQUELIZE.define('users', {
  user_id: {
    type: Sequelize.STRING(15),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: Sequelize.STRING(64),
    allowNull: false
  },
  password: {
    type: Sequelize.STRING(40),
    allowNull: true,
    defaultValue: null
  },
  first_name: {
    type: Sequelize.STRING(15),
    allowNull: true,
    defaultValue: null
  },
  last_name: {
    type: Sequelize.STRING(15),
    allowNull: true,
    defaultValue: null
  },
  phone: {
    type: Sequelize.STRING(25),
    allowNull: true,
    defaultValue: null
  },
  mail_subscription: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})

module.exports = Users
