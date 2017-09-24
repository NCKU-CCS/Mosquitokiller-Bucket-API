const PlacesModel = require('./placesModel')

class PlaceController {
  async getAll (req, res) {
    try {
      const Places = await PlacesModel.findAll({where: req.query})
      if (Places.length) {
        res.json({places: Places})
      } else {
        res.status(404).json(Places)
      }
    } catch (err) {
      res.status(500).json({error: err})
    }
  }
  async getById (req, res) {
    // block NaN id
    if (!Number.isInteger(Number(req.params.id))) {
      res.status(404).json({errors: 'not found'})
    }

    try {
      const singlePlace = await PlacesModel.findById(req.params.id)
      if (singlePlace) {
        res.json({place: singlePlace})
      } else {
        res.status(404).json({error: 'not found'})
      }
    } catch (err) {
      res.status(500).json({error: err})
    }
  }
  async create (req, res) {
    // post should have name & address key
    if (!req.body.place_name || !req.body.place_address) {
      res.status(400).json({errors: 'place_name & place_address cannot be null'})
    }

    try {
      const newPlace = await PlacesModel.create(req.body)
      res.json({place: newPlace})
    } catch (err) {
      res.status(500).json({error: err})
    }
  }
  async update (req, res) {
    try {
      const updatePlace = await PlacesModel.update(req.body, {where: {place_id: req.params.id}})
      if (updatePlace) {
        res.json({place_id: updatePlace})
      } else {
        res.status(404).json({error: 'not found'})
      }
    } catch (err) {
      res.status(500).json({error: err})
    }
  }
  async delete (req, res) {
    try {
      const deletePlace = await PlacesModel.destroy({where: {place_id: req.params.id}})
      if (deletePlace) {
        res.json(deletePlace)
      } else {
        res.status(404).json(deletePlace)
      }
    } catch (err) {
      res.status(500).json({error: err})
    }
  }
}

const controller = new PlaceController()
module.exports = controller
