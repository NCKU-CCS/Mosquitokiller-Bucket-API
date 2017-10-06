const Sequelize = require('sequelize')

const Roles = require('../roles/rolesModel')
const Permissions = require('../permissionsModel')

const rolesPermissions = global.SEQUELIZE.define('roles_permissions', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  role_id: {
    type: Sequelize.STRING(25),
    references: {
      model: Roles,
      key: 'role_id',
      deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
    }
  },
  permission_id: {
    type: Sequelize.STRING(25),
    references: {
      model: Permissions,
      key: 'permission_id',
      deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
    }
  }
}, {
  indexes: [
    {
      name: 'roles_permissions_role_id_index',
      unique: false,
      method: 'BTREE',
      fields: ['role_id']
    },
    {
      name: 'roles_permissions_permission_id_index',
      unique: false,
      method: 'BTREE',
      fields: ['permission_id']
    }
  ],
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})

module.exports = rolesPermissions
