const { BaseController } = require('../../baseController')

class RulesController extends BaseController {
  constructor (Model) {
    super(Model)

    this.ValidateCreateKeys = [
      this.check.body('timeline_upper_limit', 'timeline_upper_limit illegal').exists().custom(this._notEmpty),
      this.check.body('distance_lower_limit', 'distance_lower_limit illegal').exists().custom(this._notEmpty),
      this.check.body('points_lower_limit', 'points_lower_limit').exists().custom(this._notEmpty),
      this.check.body('counts_lower_limit', 'counts_lower_limit illegal').exists().custom(this._notEmpty)
    ]
  }
}

const Model = {
  id: 'rule_id',
  orm: require('./rulesModel')
}

module.exports = new RulesController(Model)
