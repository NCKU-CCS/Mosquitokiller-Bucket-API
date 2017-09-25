const { body } = require('express-validator/check')

const { BaseController } = require('../baseController')
const CommentsModel = require('./commentsModel')

class CommentsController extends BaseController {
  constructor (Model, modelName) {
    super(Model, modelName)

    this.ValidateCreateKeys = [
      body('lamp_id', 'lamp_id illegal').exists(),
      body('comment_content', 'comment_content illegal').exists()
    ]
  }
}

const modelName = {
  singular: 'comment',
  plural: 'comments',
  id: 'comment_id'
}

module.exports = new CommentsController(CommentsModel, modelName)
