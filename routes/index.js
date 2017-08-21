// MODULE Import
const express = require('express')
const router = express.Router()
const moment = require('moment')
const sequelize = require('../models/mcc.js')

// CONST STRING Config
const TABLE_LIST = {
  'mccs': 'mccs',
  'lamps': 'lamps',
  'lampMccs': 'lamp_mccs'
}

const QUERY_STRING = {
  'range': (req) => `SELECT ${req.db.item} FROM ${req.params.tableName} WHERE date(created_at) >= ? AND date(created_at) <= ? ${req.db.rule}`,
  'start': (req) => `SELECT ${req.db.item} FROM ${req.params.tableName} WHERE date(created_at) >= ? ${req.db.rule}`,
  'end': (req) => `SELECT ${req.db.item} FROM ${req.params.tableName} WHERE date(created_at) <= ? ${req.db.rule}`,
  'all': (req) => `SELECT ${req.db.item} FROM ${req.params.tableName} ${req.db.rule}`
}

const FORMAT_STRING = {
  'none': {item: '*', rule: ' '},
  'format': {item: 'SUM(counts), id,  date(created_at) ', rule: 'GROUP BY lamps.id, date(lamps.created_at) ORDER BY date(created_at)'}
}

const RATE_PERCENT = {
  '2': 3,
  '1': 1,
  '-1': 1,
  '-2': 0.33
}

// HANDLE GET API
router.get('/:tableName', (req, res, next) => {
  if (Object.keys(TABLE_LIST).includes(req.params.tableName)) {
    req.params.tableName = TABLE_LIST[req.params.tableName]
    const isLampFormat = (req.query.format === 'true' & req.params.tableName === 'lamps')
    req.db = isLampFormat
      ? FORMAT_STRING.format
      : FORMAT_STRING.none
    query(req, (queryData) => {
      const result = {}
      result[req.params.tableName] = (isLampFormat) ? formatLampsByDate(queryData) : queryData
      res.json(result)
    })
  } else {
    res.status(400)
    res.send('Table Not Exist')
  }
})

// QUERY PostgreSQL DATA
function query (req, next) {
  let query
  let queryValue = {type: sequelize.QueryTypes.SELECT}
  if (req.query.start && req.query.end) {
    query = QUERY_STRING.range(req)
    queryValue.replacements = [req.query.start, req.query.end]
  } else if (req.query.start) {
    query = QUERY_STRING.start(req)
    queryValue.replacements = [req.query.start]
  } else if (req.query.end) {
    query = QUERY_STRING.end(req)
    queryValue.replacements = [req.query.end]
  } else {
    query = QUERY_STRING.all(req)
  }
  console.log(query)
  sequelize.query(query, queryValue).then((queryData) => {
    next(queryData)
  })
}

function formatLampsByDate (lampsData) {
  const lampsFormatData = {}
  lampsData.forEach((item) => {
    setupDateItem(item, lampsFormatData)
  })
  return lampsFormatData
}

function setupDateItem (item, lampsFormatData) {
  const lastDate = moment(item.date, 'YYYY-MM-DD').subtract(1, 'day').format('YYYY-MM-DD')
  if (!lampsFormatData[item.date]) {
    lampsFormatData[item.date] = {}
  }
  lampsFormatData[item.date][item.id] = item
  if (lampsFormatData[lastDate] && lampsFormatData[lastDate][item.id]) {
    const rate = lampsFormatData[item.date][item.id]['sum'] / lampsFormatData[lastDate][item.id]['sum']
    lampsFormatData[item.date][item.id]['size'] = setupSizeRate(rate)
  } else {
    lampsFormatData[item.date][item.id]['size'] = 0
  }
}

function setupSizeRate (rate) {
  let size
  if (rate >= RATE_PERCENT['2']) {
    size = 2
  } else if (rate > RATE_PERCENT['1']) {
    size = 1
  } else if (rate < RATE_PERCENT['-2']) {
    size = -2
  } else if (rate < RATE_PERCENT['-1']) {
    size = -1
  } else {
    size = 0
  }
  return size
}

module.exports = router
