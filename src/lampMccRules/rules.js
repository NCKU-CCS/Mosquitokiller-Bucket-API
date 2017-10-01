const { BaseController } = require('../baseController')

class RulesController extends BaseController {
  constructor (Model) {
    super(Model)

    this.ValidateCreateKeys = [
      this.check.body('timeline_upper_limit', 'timeline_upper_limit illegal').exists(),
      this.check.body('distance_lower_limit', 'distance_lower_limit illegal').exists(),
      this.check.body('points_lower_limit', 'points_lower_limit').exists(),
      this.check.body('counts_lower_limit', 'counts_lower_limit illegal').exists()
    ]
  }
}

const Model = {
  id: 'rule_id',
  orm: require('./rulesModel')
}

module.exports = new RulesController(Model)
