const { body } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter')
const { BaseController } = require('../baseController')

const Lamps = require('./lampsModel')

class LampsController extends BaseController {
  constructor (Model, modelName) {
    super(Model, modelName)
    // block ID
    this.ValidateIdParams = []
    // block illegal or null request
    this.ValidateCreateKeys = [
      body('lamp_id', 'lamp_id should not be null').exists(),
      body('lamp_location', 'lamp_location should not be null').exists(),
      body('place_id', 'place_id should not be null').exists(),
      sanitizeBody('place_id').toInt()
    ]
    this.create = this.create.bind(this)
  }

  async create (req, res) {
    try {
      await this._validateRequest(req, res)
      // To Use Hash
      req.body.lamp_hash_id = Math.random().toString()
      const newItem = await this.Model.create(req.body)
      this._returnResponse(newItem, 'id', res)
    } catch (err) {
      res.status(500).json({error: err})
    }
  }
}

const modelName = {
  singular: 'lamp',
  plural: 'lamps',
  id: 'lamp_id'
}

const controller = new LampsController(Lamps, modelName)
module.exports = controller
