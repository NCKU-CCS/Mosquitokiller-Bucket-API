const { BaseController } = require('../baseController')
const RulesModel = require('./rulesModel')

class RulesController extends BaseController {
  constructor (Model, modelName) {
    super(Model, modelName)

    this.ValidateCreateKeys = [
      this.check.body('timeline_upper_limit', 'timeline_upper_limit illegal').exists(),
      this.check.body('distance_lower_limit', 'distance_lower_limit illegal').exists(),
      this.check.body('points_lower_limit', 'points_lower_limit').exists(),
      this.check.body('counts_lower_limit', 'counts_lower_limit illegal').exists()
    ]
  }
}

const modelName = {
  singular: 'rule',
  plural: 'rules',
  id: 'rule_id'
}

module.exports = new RulesController(RulesModel, modelName)
