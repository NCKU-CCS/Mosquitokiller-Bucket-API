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

    this.RATE_PERCENT = {
      '2': 3,
      '1': 1,
      '-1': 1,
      '-2': 0.33
    }
  }

  // =============================
  // Setup SELECT Rule
  // =============================

  _FormatRuleNotExist (formatRule) {
    const keys = ['hour', 'date']
    return !keys.includes(formatRule)
  }

  _setFormatRule (query) {
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
        order: [Sequelize.fn('date', Sequelize.col('created_at'))]
      }
    })[query.formatBy] || {order: [['created_at', 'DESC']]})
  }

  // =============================
  // Format SELECT Data
  // =============================

  // use for return diff format
  _formatItemsBy (formatRule, Items) {
    const setupItems = this._setupItemsBy(formatRule)
    const itemsFormatData = {}
    Items.forEach((item) => {
      setupItems(item, itemsFormatData)
    })
    return itemsFormatData
  }

  _setupItemsBy (formatRule) {
    return (({
      'date': this._setupDateItem,
      'hour': this._setupHourItem
    })[formatRule])
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

  _setupHourItem (item, itemsFormatData) {
    if (!itemsFormatData[item.dataValues.date]) {
      itemsFormatData[item.dataValues.date] = {}
    }
    itemsFormatData[item.dataValues.date][item.dataValues['hour']] = item
  }

  _setupSizeRate (rate) {
    return (rate >= this.RATE_PERCENT['2']) ? 2
          : (rate > this.RATE_PERCENT['1']) ? 1
          : (rate < this.RATE_PERCENT['-2']) ? -2
          : (rate < this.RATE_PERCENT['-1']) ? -1 : 0
  }

  async getAll (req, res) {
    try {
      //
      // Check Query Format rule is valid
      //
      const formatRule = req.query.formatBy || null
      if (formatRule && this._FormatRuleNotExist(formatRule)) {
        res.status(400).json({error: 'query value of formatBy not valid'})
        return
      }
      //
      // QUERY RULE
      //
      const isFormatByHour = (formatRule === 'hour')

      // convert hash_id to real lamp_id
      if (isFormatByHour && req.query.lampID) {
        const realLamp = await Lamps.findOne({where: {lamp_hash_id: {$like: `${req.query.lampID}%`}}})
        // hash id not exist, return 404
        if (!realLamp) {
          res.status(404).json({error: 'not found'})
          return
        } else {
          req.query.lampID = realLamp.lamp_id
        }
      }

      const Rule = this._setFormatRule(req.query)
      // return just one lamp data or all lamp data
      Rule.where = (req.query.lampID) ? {lamp_id: req.query.lampID} : null
      //
      // SELECT DATA
      //
      let Items = await this.Model.findAll(Rule)
      if (Items.length) {
        Items = (formatRule) ? this._formatItemsBy(formatRule, Items)
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
