const { BaseController } = require('../../baseController')

const Lamps = require('../lamps')

class CommentsController extends BaseController {
  constructor (Model) {
    super(Model)

    this.ValidateCreateKeys = [
      this.check.body('lamp_id', 'lamp_id length should large than six').exists().isLength({ min: 6 }),
      this.check.body('comment_content', 'comment_content illegal').exists().custom(this._notEmpty)
    ]
  }

  async create (req, res) {
    try {
      await this._validateRequest(req, res)

      // need to recover bot lamp_hash_id to real lamp_id
      const notCreateByRealId = (req.query.key !== 'id')
      if (notCreateByRealId) {
        // get lamp ID by first 6 characters of lamp_hash_id, if no id will throw 404
        req.body.lamp_id = await Lamps.getLampIDByHashID(req.body.lamp_id)
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
