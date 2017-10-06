const {sanitizeBody} = require('express-validator/filter')
//
// Generate Sha-1
//
const crypto = require('crypto')
const SECRET = global.CONFIG['sha256Secret']
//
// Controller Model
//
const { BaseController } = require('../../baseController')

class LampsController extends BaseController {
  constructor (Model) {
    super(Model)
    // block illegal or null request
    this.ValidateIdParams = [this.check.param('id', 'not exist').exists()]

    this.ValidateCreateKeys = [
      this.check.body('lamp_id', 'lamp_id should not be null').exists(),
      this.check.body('lamp_location', 'lamp_location should not be null').exists(),
      this.check.body('place_id', 'place_id should not be null').exists(),
      sanitizeBody('place_id').toInt()
    ]
    this.create = this.create.bind(this)
  }

  async create (req, res) {
    try {
      const status = await this._validateRequest(req, res)
      if (status === '4xx') return
      // To Use Hash
      req.body.lamp_hash_id = crypto.createHmac('sha256', SECRET)
        .update(req.body.lamp_id)
        .digest('hex')
      const newItem = await this.Model.create(req.body)
      res.set('location', `${req.path}/${newItem[this.modelId]}`)
      res.status(201).json(newItem)
    } catch (err) {
      this._sendErrorResponse(err, res)
    }
  }
}

const Model = {
  id: 'lamp_id',
  orm: require('./lampsModel')
}

module.exports = new LampsController(Model)
