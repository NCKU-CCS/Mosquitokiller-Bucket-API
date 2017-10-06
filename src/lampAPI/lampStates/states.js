const { BaseController } = require('../../baseController')

class StatesController extends BaseController {
  constructor (Model) {
    super(Model)

    this.ValidateCreateKeys = [
      this.check.body('lamp_id', 'lamp_id illegal').exists(),
      this.check.body('lamp_state', 'lamp_states illegal').exists()
    ]
  }
}

const Model = {
  id: 'state_id',
  orm: require('./statesModel')
}

module.exports = new StatesController(Model)
