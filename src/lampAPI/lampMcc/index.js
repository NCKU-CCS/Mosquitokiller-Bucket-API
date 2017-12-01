const { BaseController } = require('../../baseController')

class MccController extends BaseController {
  constructor (Model) {
    super(Model)

    this.ValidateCreateKeys = [
      this.check.body('mcc_keys', 'mcc_key illegal').exists().custom(this._notEmpty),
      this.check.body('mcc_points', 'mcc_points illegal').exists().custom(this._notEmpty),
      this.check.body('mcc_center', 'mcc_center illegal').exists().custom(this._notEmpty),
      this.check.body('rule_id', 'rule_id illegal').exists().custom(this._notEmpty)
    ]
  }
}

const Model = {
  id: 'mcc_id',
  orm: require('./mccModel')
}

module.exports = new MccController(Model)
