const { body, param } = require('express-validator/check')
const { sanitize } = require('express-validator/filter')

const { BaseController } = require('../baseController')
const StatesModel = require('./statesModel')

class StatesController extends BaseController {
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
      body('lamp_id', 'lamp_id illegal').exists(),
      body('lamp_state', 'lamp_states illegal').exists()
    ]
  }
}

const modelName = {
  singular: 'state',
  plural: 'states',
  id: 'state_id'
}

module.exports = new StatesController(StatesModel, modelName)
