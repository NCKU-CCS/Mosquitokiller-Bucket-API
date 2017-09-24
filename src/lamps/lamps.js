const LampsModel = require('./lampsModel')

class LampsController {
  async getAll (req, res) {
    try {
      const Lamps = await LampsModel.findAll({where: req.query})
      if (Lamps.length) {
        res.json({lamps: Lamps})
      } else {
        res.status(404).json(Lamps)
      }
    } catch (err) {
      res.status(500).json({error: err})
    }
  }
  async getById (req, res) {
    try {
      const singleLamps = await LampsModel.findById(req.params.id)
      if (singleLamps) {
        res.json({place: singleLamps})
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
      const newLamps = await LampsModel.create(req.body)
      res.json({place: newLamps})
    } catch (err) {
      res.status(500).json({error: err})
    }
  }
  async update (req, res) {
    try {
      const updateLamps = await LampsModel.update(req.body, {where: {place_id: req.params.id}})
      if (updateLamps) {
        res.json({place_id: updateLamps})
      } else {
        res.status(404).json({error: 'not found'})
      }
    } catch (err) {
      res.status(500).json({error: err})
    }
  }
  async delete (req, res) {
    try {
      const deleteLamps = await LampsModel.destroy({where: {place_id: req.params.id}})
      if (deleteLamps) {
        res.json(deleteLamps)
      } else {
        res.status(404).json(deleteLamps)
      }
    } catch (err) {
      res.status(500).json({error: err})
    }
  }
}

const controller = new LampsController()
module.exports = controller
