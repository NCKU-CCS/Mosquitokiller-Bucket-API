const { BaseController } = require('../../baseController')

// crypt password
const bcrypt = require('bcrypt-nodejs')

const DEFAULT_ROLE_ID = 'SUBSCRIBER'

class UsersController extends BaseController {
  constructor (Model) {
    super(Model)
    this.ValidateIdParams = [this.check.param('id', 'not exist').exists()]

    this.ValidateCreateKeys = [
      this.check.body('user_id', 'user_id illegal').exists()
        .custom(value => {
          return this.findUserByID(value).then(user => {
            if (user) throw new Error('ID_EXIST')
            return value
          })
        }),

      this.check.body('email', 'email illegal').exists()
        .isEmail().withMessage('must be an email')
        .custom(value => {
          return this.findUserByEmail(value).then(user => {
            if (user) throw new Error('EMAIL_EXIST')
            return value
          })
        })
        .trim().normalizeEmail(),

      this.check.body('password', 'PW_INVALID').exists()
    ]
  }

  _generateHash (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
  }

  validPassword (input, password) {
    return bcrypt.compareSync(input, password)
  }

  async create (req, res) {
    try {
      const status = await this._validateRequest(req, res)
      if (status === '4xx') return

      // Use Hash
      req.body.password = this._generateHash(req.body.password)
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

  // check email is valid
  async findUserByEmail (email) {
    return await this.Model.findOne({where: {'email': email}})
  }
  // check user is valid
  async findUserByID (id) {
    return await this.Model.findById(id)
  }
}

const Model = {
  id: 'user_id',
  orm: require('./usersModel')
}

module.exports = new UsersController(Model)
