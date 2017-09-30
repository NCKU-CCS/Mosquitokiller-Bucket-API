const { body } = require('express-validator/check')

const { BaseController } = require('../baseController')
const CountsModel = require('./countsModel')

const moment = require('moment')
const Sequelize = require('sequelize')

class CountsController extends BaseController {
  constructor (Model, modelName) {
    super(Model, modelName)

    this.ValidateCreateKeys = [
      body('lamp_id', 'lamp_id illegal').exists(),
      body('counts', 'counts illegal').exists()
    ]
    // Bind Private function
    this._setupDateItem = this._setupDateItem.bind(this)

    this.RATE_PERCENT = {
      '2': 3,
      '1': 1,
      '-1': 1,
      '-2': 0.33
    }
  }
  // use for return date format
  _formatItemsByDate (Items) {
    const itemsFormatData = {}
    Items.forEach((item) => {
      this._setupDateItem(item, itemsFormatData)
    })
    return itemsFormatData
  }
  _setupDateItem (item, itemsFormatData) {    
    if (!itemsFormatData[item.dataValues.date]) {
      itemsFormatData[item.dataValues.date] = {}
    }
    itemsFormatData[item.dataValues.date][item.dataValues['lamp_id']] = item

    // calculate Point Size
    const lastDate = moment(item.dataValues.date, 'YYYY-MM-DD').subtract(1, 'day').format('YYYY-MM-DD')
    if (itemsFormatData[lastDate] && itemsFormatData[lastDate][item.dataValues[this.modelName['id']]]) {
      const rate = itemsFormatData[item.dataValues.date][item.dataValues['lamp_id']]['sum'] / itemsFormatData[lastDate][item.dataValues['lamp_id']]['sum']
      itemsFormatData[item.dataValues.date][item.dataValues['lamp_id']]['dataValues']['size'] = this._setupSizeRate(rate)
    } else {
      itemsFormatData[item.dataValues.date][item.dataValues['lamp_id']]['dataValues']['size'] = 0
    }
  }

  _setupSizeRate (rate) {
    let size
    if (rate >= this.RATE_PERCENT['2']) {
      size = 2
    } else if (rate > this.RATE_PERCENT['1']) {
      size = 1
    } else if (rate < this.RATE_PERCENT['-2']) {
      size = -2
    } else if (rate < this.RATE_PERCENT['-1']) {
      size = -1
    } else {
      size = 0
    }
    return size
  }

  async getAll (req, res) {
    try {
      //
      // QUERY RULE
      //
      let Rule
      const formatByDate = (req.query.formatBy === 'date')
      if (formatByDate) {
        Rule = {
          attributes: [
            'lamp_id',
            [Sequelize.fn('count', Sequelize.col('counts')), 'sum'],
            [Sequelize.fn('date', Sequelize.col('created_at')), 'date']
          ],
          group: ['lamp_id', [Sequelize.fn('date', Sequelize.col('created_at'))]],
          order: [Sequelize.fn('date', Sequelize.col('created_at'))]
        }
      } else {
        Rule = {where: req.query, order: [['created_at', 'DESC']]}
      }
      //
      // SELECT DATA
      //
      let Items = await this.Model.findAll(Rule)
      if (Items.length) {
        Items = (formatByDate) ? this._formatItemsByDate(Items) : Items
        res.json(Items)
      } else {
        res.status(404).json({error: 'not found'})
      }
    } catch (err) {
      console.log(err)
      res.status(500).json({error: err})
    }
  }
}

const modelName = {
  singular: 'count',
  plural: 'counts',
  id: 'count_id'
}

module.exports = new CountsController(CountsModel, modelName)
