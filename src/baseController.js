const { body, param, query, validationResult } = require('express-validator/check')
const { matchedData, sanitize } = require('express-validator/filter')
//
// API BASE CLASS
//
exports.BaseController = class {
  constructor (Model) {
    // table model
    this.Model = Model.orm
    this.modelId = Model.id
    // check method
    this.check = {body, param, query}

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

  _notEmpty (value) {
    if (value && Array.isArray(value)) {
      return !value.includes('')
    } else if (value) {
      return true
    } else {
      return false
    }
  }

  _validateRequest (req, res) {
    return new Promise((resolve, reject) => {
      const errors = validationResult(req)
      // check id param valid
      if (errors.mapped().id) {
        throw new Error('404')
      } else if (!errors.isEmpty()) {
        const badRequest = new Error('400')
        badRequest.payload = errors.mapped()
        throw badRequest
      }
      resolve()
    })
  }

  // use in update & delete request
  // generate different {'item_id': req.params.id}
  _setIdFilter (req) {
    const filterRules = {}
    filterRules[this.modelId] = req.params.id
    return filterRules
  }

  _returnItemOrNotFound (Item, res) {
    if (Item) {
      res.json(Item)
    } else {
      throw new Error('404')
    }
  }

  _sendErrorResponse (err, res) {
    (err.name === 'SequelizeForeignKeyConstraintError') ? res.status(400).json({error: 'violates foreign key constraint'})
    : (err.message === '400') ? res.status(400).json({error: err.payload})
    : (err.message === '404') ? res.status(404).json({error: 'not found'})
                              : res.status(500).json({error: err.message})
  }

  async getAll (req, res) {
    try {
      const Items = await this.Model.findAll({where: req.query, oreder: [['created_at', 'DESC']]})
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
      await this._validateRequest(req, res)

      const params = await matchedData(req)
      const singleItem = await this.Model.findById(params.id)
      this._returnItemOrNotFound(singleItem, res)
    } catch (err) {
      this._sendErrorResponse(err, res)
    }
  }

  async create (req, res) {
    try {
      await this._validateRequest(req, res)

      const newItem = await this.Model.create(req.body)
      res.set('location', `${req.path}/${newItem[this.modelId]}`)
      res.status(201).json(newItem)
    } catch (err) {
      this._sendErrorResponse(err, res)
    }
  }

  async update (req, res) {
    try {
      const filterRules = this._setIdFilter(req)
      const updateItem = await this.Model.update(req.body, {where: filterRules, returning: true})
      if (updateItem[0]) {
        res.status(200).json(updateItem[1][0])
      } else {
        res.status(404).json({error: 'not found'})
      }
    } catch (err) {
      this._sendErrorResponse(err, res)
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
      this._sendErrorResponse(err, res)
    }
  }
}
