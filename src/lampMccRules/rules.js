const { body } = require('express-validator/check')

const { BaseController } = require('../baseController')
const RulesModel = require('./rulesModel')

class RulesController extends BaseController {
  constructor (Model, modelName) {
    super(Model, modelName)

    this.ValidateCreateKeys = [
      body('timeline_upper_limit', 'timeline_upper_limit illegal').exists(),
      body('distance_lower_limit', 'distance_lower_limit illegal').exists(),
      body('points_lower_limit', 'points_lower_limit').exists(),
      body('counts_lower_limit', 'counts_lower_limit illegal').exists()
    ]
  }
}

const modelName = {
  singular: 'rule',
  plural: 'rules',
  id: 'rule_id'
}

module.exports = new RulesController(RulesModel, modelName)
