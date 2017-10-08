const { BaseController } = require('../../baseController')
const Lamps = require('../lamps/lampsModel')

const moment = require('moment')
const Sequelize = require('sequelize')

class CountsController extends BaseController {
  constructor (Model) {
    super(Model)

    this.ValidateCreateKeys = [
      this.check.body('lamp_id', 'lamp_id illegal').exists(),
      this.check.body('counts', 'counts illegal').exists()
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
  _formatItemsByDate (Items, next) {
    const itemsFormatData = {}
    Items.forEach((item) => {
      next(item, itemsFormatData)
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
    if (itemsFormatData[lastDate] && itemsFormatData[lastDate][item.dataValues[this.modelId]]) {
      const rate = itemsFormatData[item.dataValues.date][item.dataValues['lamp_id']]['sum'] / itemsFormatData[lastDate][item.dataValues['lamp_id']]['sum']
      itemsFormatData[item.dataValues.date][item.dataValues['lamp_id']]['dataValues']['size'] = this._setupSizeRate(rate)
    } else {
      itemsFormatData[item.dataValues.date][item.dataValues['lamp_id']]['dataValues']['size'] = 0
    }
  }

  _setupSizeRate (rate) {
    return (rate >= this.RATE_PERCENT['2']) ? 2
          : (rate > this.RATE_PERCENT['1']) ? 1
          : (rate < this.RATE_PERCENT['-2']) ? -2
          : (rate < this.RATE_PERCENT['-1']) ? -1 : 0
  }

  _setupHourItem (item, itemsFormatData) {
    if (!itemsFormatData[item.dataValues.date]) {
      itemsFormatData[item.dataValues.date] = {}
    }
    itemsFormatData[item.dataValues.date][item.dataValues['hour']] = item
  }

  _FormatRule (req) {
    return (({
      'date': {
        attributes: [
          'lamp_id',
          [Sequelize.fn('count', Sequelize.col('counts')), 'sum'],
          [Sequelize.fn('date', Sequelize.col('created_at')), 'date']
        ],
        group: ['lamp_id', [Sequelize.fn('date', Sequelize.col('created_at'))]],
        order: [Sequelize.fn('date', Sequelize.col('created_at'))]
      },
      'hour': {
        attributes: [
          [Sequelize.fn('count', Sequelize.col('counts')), 'sum'],
          [Sequelize.fn('date', Sequelize.col('created_at')), 'date'],
          [Sequelize.fn('date_part', 'hour', Sequelize.col('created_at')), 'hour']
        ],
        group: ['lamp_id', [Sequelize.fn('date', Sequelize.col('created_at'))], [Sequelize.fn('date_part', 'hour', Sequelize.col('created_at'))]],
        order: [Sequelize.fn('date', Sequelize.col('created_at'))],
        where: {lamp_id: req.query.lamp_id}
      }
    })[req.query.formatBy] || {order: [['created_at', 'DESC']]})
  }

  async getAll (req, res) {
    try {
      //
      // QUERY RULE
      //
      const isFormatByDate = (req.query.formatBy === 'date')
      const isFormatByHour = (req.query.formatBy === 'hour')

      // trans hash_id to real lamp_id
      if (isFormatByHour && req.query.lampID) {
        const realLamp = await Lamps.findOne({where: {lamp_hash_id: {$like: `${req.query.lampID}%`}}})
        // no this hash id, return 404
        if (!realLamp) {
          res.status(404).json({error: 'not found'})
          return
        } else {
          req.query.lamp_id = realLamp.lamp_id
        }
      }

      const Rule = this._FormatRule(req)
      //
      // SELECT DATA
      //
      let Items = await this.Model.findAll(Rule)
      if (Items.length) {
        Items = (isFormatByDate) ? this._formatItemsByDate(Items, this._setupDateItem)
              : (isFormatByHour) ? this._formatItemsByDate(Items, this._setupHourItem)
                                 : Items
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

const Model = {
  id: 'count_id',
  orm: require('./countsModel')
}

module.exports = new CountsController(Model)
