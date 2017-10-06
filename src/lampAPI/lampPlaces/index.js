const { BaseController } = require('../../baseController')

class PlacesController extends BaseController {
  constructor (Model) {
    super(Model)

    this.ValidateCreateKeys = [
      this.check.body('place_name', 'place_name illegal').exists(),
      this.check.body('place_address', 'place_address illegal').exists()
    ]
  }
}

const Model = {
  id: 'place_id',
  orm: require('./placesModel')
}

module.exports = new PlacesController(Model)
