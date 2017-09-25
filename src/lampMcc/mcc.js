const { body, param } = require('express-validator/check')
const { sanitize } = require('express-validator/filter')

const { BaseController } = require('../baseController')
const MccModel = require('./mccModel')

class MccController extends BaseController {
  constructor (Model, modelName) {
    super(Model, modelName)

    this.ValidateIdParams = [
      param('id', 'id should be a int').custom(id => {
        if (!Number.isInteger(Number(id))) {
          throw new Error('id format illegal')
        }
        return id
      }),
      sanitize('id').toInt()
    ]

    this.ValidateCreateKeys = [
      body('mcc_keys', 'mcc_key illegal').exists(),
      body('mcc_points', 'mcc_points illegal').exists(),
      body('mcc_center', 'mcc_center illegal').exists(),
      body('rule_id', 'rule_id illegal').exists()
    ]
  }
}

const modelName = {
  singular: 'mcc',
  plural: 'mcc',
  id: 'mcc_id'
}

module.exports = new MccController(MccModel, modelName)
