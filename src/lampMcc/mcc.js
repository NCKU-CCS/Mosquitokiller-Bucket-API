const MccModel = require('./mccModel')

class MccController {
  async getAll (req, res) {
    try {
      const Mcc = await MccModel.findAll({where: req.query})
      if (Mcc.length) {
        res.json({mcc: Mcc})
      } else {
        res.status(404).json(Mcc)
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
      const singleMcc = await MccModel.findById(req.params.id)
      if (singleMcc) {
        res.json({place: singleMcc})
      } else {
        res.status(404).json({error: 'not found'})
      }
    } catch (err) {
      res.status(500).json({error: err})
    }
  }
  async create (req, res) {
    // post should have these keys
    if (!req.body.mcc_keys || !req.body.mcc_points || !req.body.mcc_center || !req.body.rule_id) {
      res.status(400).json({errors: 'place_name & place_address cannot be null'})
    }

    try {
      const newMcc = await MccModel.create(req.body)
      res.json({place: newMcc})
    } catch (err) {
      res.status(500).json({error: err})
    }
  }
  async update (req, res) {
    try {
      const updateMcc = await MccModel.update(req.body, {where: {place_id: req.params.id}})
      if (updateMcc) {
        res.json({place_id: updateMcc})
      } else {
        res.status(404).json({error: 'not found'})
      }
    } catch (err) {
      res.status(500).json({error: err})
    }
  }
  async delete (req, res) {
    try {
      const deleteMcc = await MccModel.destroy({where: {place_id: req.params.id}})
      if (deleteMcc) {
        res.json(deleteMcc)
      } else {
        res.status(404).json(deleteMcc)
      }
    } catch (err) {
      res.status(500).json({error: err})
    }
  }
}

const controller = new MccController()
module.exports = controller
