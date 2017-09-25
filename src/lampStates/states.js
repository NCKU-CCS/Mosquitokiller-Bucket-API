const { body } = require('express-validator/check')

const { BaseController } = require('../baseController')
const StatesModel = require('./statesModel')

class StatesController extends BaseController {
  constructor (Model, modelName) {
    super(Model, modelName)

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
