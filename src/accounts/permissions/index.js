const { BaseController } = require('../../baseController')

class PermissionsController extends BaseController {
  constructor (Model) {
    super(Model)
    // block illegal or null request
    this.ValidateIdParams = [this.check.param('id', 'not exist').exists()]

    this.ValidateCreateKeys = [
      this.check.body('permission_id', 'permission_id illegal').exists(),
      this.check.body('permission_description', 'permission_description illegal').exists()
    ]
  }
}

const Model = {
  id: 'permission_id',
  orm: require('./permissionsModel')
}

module.exports = new PermissionsController(Model)
