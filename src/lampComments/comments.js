const { BaseController } = require('../baseController')

class CommentsController extends BaseController {
  constructor (Model) {
    super(Model)

    this.ValidateCreateKeys = [
      this.check.body('lamp_id', 'lamp_id illegal').exists(),
      this.check.body('comment_content', 'comment_content illegal').exists()
    ]
  }
}

const Model = {
  id: 'comment_id',
  orm: require('./commentsModel')
}

module.exports = new CommentsController(Model)
