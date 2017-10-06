// Exports Accounts Model
module.exports = {
  Permissions: require('./permissions/permissionsModel.js'),
  Roles: require('./roles/rolesModel.js'),
  Users: require('./users/usersModel.js'),
  RolesPermissions: require('./rolesPermissions/rolesPermissionsModel.js'),
  UsersRoles: require('./usersRoles/usersRolesModel.js')
}
