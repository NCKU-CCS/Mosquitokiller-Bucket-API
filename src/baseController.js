const { param, validationResult } = require('express-validator/check')
const { matchedData, sanitize } = require('express-validator/filter')
//
// API BASE CLASS
//
exports.BaseController = class {
  constructor (Model, modelName) {
    // table model
    this.Model = Model
    // with key: singular, plural, id
    this.modelName = modelName

    this.ValidateIdParams = [
      param('id', 'id should be a int').custom(id => {
        if (!Number.isInteger(Number(id))) {
          throw new Error('id format illegal')
        }
        return id
      }),
      sanitize('id').toInt()
    ]

    this.ValidateCreateKeys = []
    // Bind Main Function
    this.getAll = this.getAll.bind(this)
    this.getById = this.getById.bind(this)
    this.create = this.create.bind(this)
    this.update = this.update.bind(this)
    this.delete = this.delete.bind(this)
  }

  _validateRequest (req, res) {
    return new Promise((resolve, reject) => {
      const errors = validationResult(req)
      // check id param valid
      if (errors.mapped().id) {
        res.status(404).json({ errors: 'not found' })
        resolve('4xx')
      } else if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.mapped() })
        resolve('4xx')
      }
      resolve('200')
    })
  }

  _returnResponse (data, type, res) {
    const jsonData = {}
    jsonData[this.modelName[type]] = data
    res.json(jsonData)
  }

  // use in update & delete request
  // generate different {'item_id': req.params.id}
  _setIdFilter (req) {
    const filterRules = {}
    filterRules[this.modelName['id']] = req.params.id
    return filterRules
  }

  async getAll (req, res) {
    try {
      const Items = await this.Model.findAll({where: req.query})
      if (Items.length) {
        this._returnResponse(Items, 'plural', res)
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

      const params = await matchedData(req)
      const singleItem = await this.Model.findById(params.id)
      if (singleItem) {
        this._returnResponse(singleItem, 'singular', res)
      } else {
        res.status(404).json({error: 'not found'})
      }
    } catch (err) {
      res.status(500).json({error: err})
    }
  }

  async create (req, res) {
    try {
      const status = await this._validateRequest(req, res)
      if (status === '4xx') return

      const newItem = await this.Model.create(req.body)
      this._returnResponse(newItem, 'singular', res)
    } catch (err) {
      res.status(500).json({error: err})
    }
  }

  async update (req, res) {
    try {
      const filterRules = this._setIdFilter(req)
      const updateItem = await this.Model.update(req.body, {where: filterRules})
      if (updateItem) {
        this._returnResponse(updateItem, 'id', res)
      } else {
        res.status(404).json({error: 'not found'})
      }
    } catch (err) {
      res.status(500).json({error: err})
    }
  }

  async delete (req, res) {
    try {
      const filterRules = this._setIdFilter(req)
      const deleteResult = await this.Model.destroy({where: filterRules})
      if (deleteResult) {
        res.status(204).json(deleteResult)
      } else {
        res.status(404).json(deleteResult)
      }
    } catch (err) {
      res.status(500).json({error: err})
    }
  }
}
