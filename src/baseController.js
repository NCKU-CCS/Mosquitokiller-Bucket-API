const { validationResult } = require('express-validator/check')
//
// API BASE CLASS
//
exports.BaseController = class {
  constructor (Model, modelName) {
    // table model
    this.Model = Model
    // with key: singular, plural, id
    this.modelName = modelName

    this.ValidateIdParams = []

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
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.mapped() })
      }
      resolve()
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
      const singleItem = await this.Model.findById(req.params.id)
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
      await this._validateRequest(req, res)
      const newItem = await this.Model.create(req.body)
      this._returnResponse(newItem, 'id', res)
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
        res.json(deleteResult)
      } else {
        res.status(404).json(deleteResult)
      }
    } catch (err) {
      res.status(500).json({error: err})
    }
  }
}
