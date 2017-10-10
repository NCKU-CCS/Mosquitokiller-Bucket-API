const {matchedData, sanitizeBody} = require('express-validator/filter')
//
// Generate Sha-1
//
const crypto = require('crypto')
const SECRET = global.CONFIG['sha256Secret']
const BASIC_ATTRIBUTES = ['lamp_id', 'lamp_location', 'lamp_deployed_date', 'place_id']
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
    // this.getLampDataByHashID = this.getLampDataByHashID.bind(this)
  }

  async getAll (req, res) {
    try {
      const attributes = BASIC_ATTRIBUTES
      // login user can check hash id
      if (req.isAuthenticated()) {
        attributes.push('lamp_hash_id', 'lamp_wifi_ssid', 'lamp_wifi_password')
      }
      const Items = await this.Model.findAll({attributes, where: req.query})
      if (Items.length) {
        res.json(Items)
      } else {
        res.status(404).json({error: 'not found'})
      }
    } catch (err) {
      res.status(500).json({error: err})
    }
  }

  async getById (req, res) {
    try {
      const status = await this._validateRequest(req, res)
      if (status === '4xx') return

      // return valid req data
      const params = await matchedData(req)

      // search by hash or normal id
      const attributes = BASIC_ATTRIBUTES
      const queryByHash = (req.query.key === 'hash')
      const singleItem = (queryByHash) ? await this.Model.findOne({attributes, where: {lamp_hash_id: {$like: `${params.id}%`}}})
                                       : await this.Model.findById(params.id, {attributes})
      // return Quey Results
      this._returnItemOrNotFound(singleItem, res)
    } catch (err) {
      this._sendErrorResponse(err, res)
    }
  }

  async getLampIDByHashID (lampHashId) {
    const attributes = BASIC_ATTRIBUTES
    const realLamp = await this.Model.findOne({attributes, where: {lamp_hash_id: {$like: `${lampHashId}%`}}})
    if (realLamp) {
      return realLamp.lamp_id
    } else {
      throw new Error('404')
    }
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
