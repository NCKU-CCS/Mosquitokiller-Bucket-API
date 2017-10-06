const Sequelize = require('sequelize')

const Users = require('../users/usersModel')
const Roles = require('../roles/rolesModel')

const usersRoles = global.SEQUELIZE.define('users_roles', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: Sequelize.STRING(15),
    references: {
      model: Users,
      key: 'user_id',
      deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
    }
  },
  role_id: {
    type: Sequelize.STRING(25),
    references: {
      model: Roles,
      key: 'role_id',
      deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
    },
    defaultValue: 'SUBSCRIBER'
  }
}, {
  indexes: [
    {
      name: 'users_roles_user_id_index',
      unique: false,
      method: 'BTREE',
      fields: ['user_id']
    },
    {
      name: 'users_roles_role_id_index',
      unique: false,
      method: 'BTREE',
      fields: ['role_id']
    }
  ],
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})

module.exports = usersRoles
