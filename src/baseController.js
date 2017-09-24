
class BaseController {
  constructor (Model, modelName) {
    // table model
    this.Model = Model
    // with key: singular, plural, id
    this.modelName = modelName
  }

  // block NaN id params
  _validateIdParams (req, res) {
    if (!Number.isInteger(Number(req.params.id))) {
      res.status(404).json({errors: 'not found'})
    }
  }

  _returnResponse (data, type, res) {
    const jsonData = {}
    jsonData[this.modelName[type]] = data
    res.json(jsonData)
  }

  _validateCreateKeys (res) {
    console.log('suit by child resources')
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
      // block NaN id
      this._validateIdParams(req, res)
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
      // block illegal keys
      this._validateCreateKeys(res)
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

const controller = new BaseController()
module.exports = controller
