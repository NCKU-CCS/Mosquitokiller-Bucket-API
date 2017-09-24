const Sequelize = require('sequelize')
const sequelize = require('../../connection/lampsConnect.js')
// import lamp_id foreign key
const Lamps = require('../lamps/lampsModel.js')

const Comments = sequelize.define('lamp_comments', {
  comment_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  lamp_id: {
    type: Sequelize.STRING(25),
    references: {
      model: Lamps,
      key: 'lamp_id',
      deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
    }
  },
  comment_content: {
    type: Sequelize.TEXT,
    allowNull: false
  }
}, {
  indexes: [
    {
      name: 'comments_lamp_id_index',
      unique: false,
      method: 'BTREE',
      fields: ['lamp_id']
    },
    {
      name: 'comments_created_at_index',
      unique: false,
      method: 'BTREE',
      fields: ['created_at']
    }
  ],
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
})

module.exports = Comments
