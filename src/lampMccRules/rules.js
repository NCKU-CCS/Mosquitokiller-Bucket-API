const RulesModel = require('./rulesModel')

class RulesController {
  async getAll (req, res) {
    try {
      const Rules = await RulesModel.findAll({where: req.query})
      if (Rules.length) {
        res.json({rules: Rules})
      } else {
        res.status(404).json(Rules)
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
      const singleRules = await RulesModel.findById(req.params.id)
      if (singleRules) {
        res.json({place: singleRules})
      } else {
        res.status(404).json({error: 'not found'})
      }
    } catch (err) {
      res.status(500).json({error: err})
    }
  }
  async create (req, res) {
    // post should have these keys
    if (!req.body.timeline_upper_limit || !req.body.distance_lower_limit || !req.body.points_lower_limit || !req.body.counts_lower_limit) {
      res.status(400).json({errors: 'place_name & place_address cannot be null'})
    }

    try {
      const newRules = await RulesModel.create(req.body)
      res.json({place: newRules})
    } catch (err) {
      res.status(500).json({error: err})
    }
  }
  async update (req, res) {
    try {
      const updateRules = await RulesModel.update(req.body, {where: {place_id: req.params.id}})
      if (updateRules) {
        res.json({place_id: updateRules})
      } else {
        res.status(404).json({error: 'not found'})
      }
    } catch (err) {
      res.status(500).json({error: err})
    }
  }
  async delete (req, res) {
    try {
      const deleteRules = await RulesModel.destroy({where: {place_id: req.params.id}})
      if (deleteRules) {
        res.json(deleteRules)
      } else {
        res.status(404).json(deleteRules)
      }
    } catch (err) {
      res.status(500).json({error: err})
    }
  }
}

const controller = new RulesController()
module.exports = controller
