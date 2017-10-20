const { BaseController } = require('../../baseController')
const Lamps = require('../lamps')

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
    this._setupDateItem = this._setupDateItem.bind(this)
    this._setupHourItem = this._setupHourItem.bind(this)
  }

  // =============================
  // Setup SELECT Rule
  // =============================

  _FormatRuleNotExist (formatRule) {
    const keys = ['hour', 'date']
    return !keys.includes(formatRule)
  }

  _setFormatRule (formatBy) {
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
          'lamp_id',
          [Sequelize.fn('count', Sequelize.col('counts')), 'sum'],
          [Sequelize.fn('date', Sequelize.col('created_at')), 'date'],
          [Sequelize.fn('date_part', 'hour', Sequelize.col('created_at')), 'hour']
        ],
        group: ['lamp_id', [Sequelize.fn('date', Sequelize.col('created_at'))], [Sequelize.fn('date_part', 'hour', Sequelize.col('created_at'))]],
        order: [Sequelize.fn('date', Sequelize.col('created_at'))]
      }
    })[formatBy] || {order: [['created_at', 'DESC']]})
  }

  // =============================
  // Format SELECT Data
  // =============================

  // use for return diff format
  _formatItemsBy (formatRule, Items) {
    const setupItems = this._setupItemsBy(formatRule.formatBy)
    const itemsFormatData = {}
    Items.forEach((item) => {
      item.dataValues['lamp_id'] = formatRule.lampHashID || item.dataValues['lamp_id'];
      (setupItems) && setupItems(item, itemsFormatData)
    })
    return (setupItems) ? itemsFormatData : Items
  }

  _setupItemsBy (formatBy) {
    return (({
      'date': this._setupDateItem,
      'hour': this._setupHourItem
    })[formatBy] || null)
  }

  _InsertNewItemBy (keys, item, itemsFormatData) {
    return new Promise((resolve, reject) => {
      if (!itemsFormatData[item.dataValues[keys[0]]]) {
        itemsFormatData[item.dataValues[keys[0]]] = {}
      }
      itemsFormatData[item.dataValues[keys[0]]][item.dataValues[keys[1]]] = item
      resolve()
    })
  }

  async _setupHourItem (item, itemsFormatData) {
    await this._InsertNewItemBy(['date', 'hour'], item, itemsFormatData)
  }

  async _setupDateItem (item, itemsFormatData) {
    await this._InsertNewItemBy(['date', 'lamp_id'], item, itemsFormatData)
    this._setupPointSize(item, itemsFormatData)
  }

  _setupPointSize (item, itemsFormatData) {
    // calculate Point Size
    const lastDate = moment(item.dataValues.date, 'YYYY-MM-DD').subtract(1, 'day').format('YYYY-MM-DD')
    if (itemsFormatData[lastDate] && itemsFormatData[lastDate][item.dataValues['lamp_id']]) {
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

  async getAll (req, res) {
    try {
      //
      // Check Counts Format rule is valid
      //
      const formatRule = {}
      if (req.query.formatBy) { formatRule.formatBy = req.query.formatBy }
      if (formatRule.formatBy && this._FormatRuleNotExist(formatRule.formatBy)) {
        res.status(400).json({error: 'query value of formatBy not valid'})
        return
      }

      // convert hash_id to real lamp_id for query & save lampHashID for convert result
      if (req.query.lampHashID) {
        formatRule.lampHashID = req.query.lampHashID
        req.query.lampID = await Lamps.getLampIDByHashID(req.query.lampHashID)
      }

      //
      // SET QUERY RULE
      //
      const Rule = this._setFormatRule(req.query.formatBy)
      // return just one lamp data or all lamp data
      if (req.query.lampID || req.query.limit) { Rule.where = {} }
      if (req.query.lampID) { Rule.where.lamp_id = req.query.lampID }
      if (req.query.limit) { Rule.where.created_at = { $gte: moment().subtract(req.query.limit, 'days').toDate().setUTCHours(0, 0, 0, 0) } }

      //
      // SELECT DATA
      //
      let Items = await this.Model.findAll(Rule)
      if (Items.length) {
        Items = (Object.keys(formatRule).length !== 0) ? this._formatItemsBy(formatRule, Items) : Items
        res.json(Items)
      } else {
        res.status(404).json({error: 'not found'})
      }
    } catch (err) {
      this._sendErrorResponse(err, res)
    }
  }
}

const Model = {
  id: 'count_id',
  orm: require('./countsModel')
}

module.exports = new CountsController(Model)
