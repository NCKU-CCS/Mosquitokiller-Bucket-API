const { BaseController } = require('../baseController')
const PlacesModel = require('./placesModel')

class PlacesController extends BaseController {
  constructor (Model, modelName) {
    super(Model, modelName)

    this.ValidateCreateKeys = [
      this.check.body('place_name', 'place_name illegal').exists(),
      this.check.body('place_address', 'place_address illegal').exists()
    ]
  }
}

const modelName = {
  singular: 'place',
  plural: 'places',
  id: 'place_id'
}

module.exports = new PlacesController(PlacesModel, modelName)
