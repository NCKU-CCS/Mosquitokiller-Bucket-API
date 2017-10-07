const Sequelize = require('sequelize')

const Roles = require('../roles/rolesModel')

const Users = global.SEQUELIZE.define('users', {
  user_id: {
    type: Sequelize.STRING(15),
    allowNull: false,
    primaryKey: true
  },
  email: {
    type: Sequelize.STRING(64),
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING(64),
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
  },
  role_id: {
    type: Sequelize.STRING(25),
    references: {
      model: Roles,
      key: 'role_id',
      deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
    }
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})

module.exports = Users
