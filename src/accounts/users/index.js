const { BaseController } = require('../../baseController')

// crypt password
const bcrypt = require('bcrypt-nodejs')

const DEFAULT_ROLE_ID = 'SUBSCRIBER'

class UsersController extends BaseController {
  constructor (Model) {
    super(Model)
    this.ValidateIdParams = [this.check.param('id', 'not exist').exists()]

    this.ValidateCreateKeys = [
      this.check.body('user_id', 'user_id illegal').exists(),
      this.check.body('email', 'email illegal').exists(),
      this.check.body('password', 'password illegal').exists()
    ]
  }

  _generateHash (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
  }

  async create (req, res) {
    try {
      const status = await this._validateRequest(req, res)
      if (status === '4xx') return
      // Use Hash
      req.body.password = this._generateHash(req.body.password)
      console.log(req.body.password)
      // Add other not null fields
      req.body.role_id = DEFAULT_ROLE_ID
      req.body.mail_subscription = true
      const newItem = await this.Model.create(req.body)
      res.set('location', `${req.path}/${newItem[this.modelId]}`)
      res.status(201).json(newItem)
    } catch (err) {
      this._sendErrorResponse(err, res)
    }
  }
}

const Model = {
  id: 'user_id',
  orm: require('./usersModel')
}

module.exports = new UsersController(Model)
