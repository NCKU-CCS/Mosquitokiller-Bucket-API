const { body } = require('express-validator/check')

const { BaseController } = require('../baseController')
const CountsModel = require('./countsModel')

class CountsController extends BaseController {
  constructor (Model, modelName) {
    super(Model, modelName)

    this.ValidateCreateKeys = [
      body('lamp_id', 'lamp_id illegal').exists(),
      body('counts', 'counts illegal').exists()
    ]
  }
}

const modelName = {
  singular: 'count',
  plural: 'counts',
  id: 'count_id'
}

module.exports = new CountsController(CountsModel, modelName)
