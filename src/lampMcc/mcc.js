const { BaseController } = require('../baseController')
const MccModel = require('./mccModel')

class MccController extends BaseController {
  constructor (Model, modelName) {
    super(Model, modelName)

    this.ValidateCreateKeys = [
      this.check.body('mcc_keys', 'mcc_key illegal').exists(),
      this.check.body('mcc_points', 'mcc_points illegal').exists(),
      this.check.body('mcc_center', 'mcc_center illegal').exists(),
      this.check.body('rule_id', 'rule_id illegal').exists()
    ]
  }
}

const modelName = {
  singular: 'mcc',
  plural: 'mcc',
  id: 'mcc_id'
}

module.exports = new MccController(MccModel, modelName)
