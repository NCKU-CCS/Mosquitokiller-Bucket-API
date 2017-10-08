const { BaseController } = require('../../baseController')

const Lamps = require('../lamps/lampsModel')

class CommentsController extends BaseController {
  constructor (Model) {
    super(Model)

    this.ValidateCreateKeys = [
      this.check.body('lamp_id', 'lamp_id illegal').exists(),
      this.check.body('comment_content', 'comment_content illegal').exists()
    ]
  }

  async create (req, res) {
    try {
      const status = await this._validateRequest(req, res)
      if (status === '4xx') return

      // recover bot lamp_hash_id to real lamp_id
      const notCreateByRealId = (req.query.key !== 'id')
      if (notCreateByRealId) {
        // get lamp by (first 6 characters of lamp_hash_id)
        const realLamp = await Lamps.findOne({where: {lamp_hash_id: {$like: `${req.body.lamp_id}%`}}})
        req.body.lamp_id = realLamp.lamp_id
      }
      // save to db
      const newItem = await this.Model.create(req.body)
      res.set('location', `${req.path}/${newItem[this.modelId]}`)
      res.status(201).json(newItem)
    } catch (err) {
      this._sendErrorResponse(err, res)
    }
  }
}

const Model = {
  id: 'comment_id',
  orm: require('./commentsModel')
}

module.exports = new CommentsController(Model)
