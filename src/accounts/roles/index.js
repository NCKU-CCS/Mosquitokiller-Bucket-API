const { BaseController } = require('../../baseController')

class RolesController extends BaseController {
  constructor (Model) {
    super(Model)
    this.ValidateIdParams = [this.check.param('id', 'not exist').exists()]

    this.ValidateCreateKeys = [
      this.check.body('role_id', 'lamp_id illegal').exists(),
      this.check.body('role_description', 'role_description illegal').exists(),
      this.check.body('role_permissions', 'role_permissions illegal').exists()
    ]
  }
}

const Model = {
  id: 'role_id',
  orm: require('./rolesModel')
}

module.exports = new RolesController(Model)
