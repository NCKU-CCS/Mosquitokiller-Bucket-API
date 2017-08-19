const express = require('express')
const router = express.Router()
const sequelize = require('../models/mcc.js')

/* GET home page. */
router.get('/mcc', function (req, res, next) {
  let query
  let queryValue = {type: sequelize.QueryTypes.SELECT}
  if (req.query.start & req.query.end) {
    query = 'SELECT * FROM mccs WHERE date(created_at) >= ? AND date(created_at) <= ?'
    queryValue.replacements = [req.query.start, req.query.end]
  } else if (req.query.start) {
    query = 'SELECT * FROM mccs WHERE date(created_at) >= ?'
    queryValue.replacements = [req.query.start]
  } else if (req.query.end) {
    query = 'SELECT * FROM mccs WHERE date(created_at) <= ?'
    queryValue.replacements = [req.query.end]
  } else {
    query = 'SELECT * FROM mccs'
  }
  sequelize.query(query, queryValue).then((mccs) => {
    res.json({'mccs': mccs})
  })
})

router.get('/lamps', function (req, res, next) {
  let query
  let queryValue = {type: sequelize.QueryTypes.SELECT}
  if (req.query.start & req.query.end) {
    query = 'SELECT * FROM lamps WHERE date(created_at) >= ? AND date(created_at) <= ?'
    queryValue.replacements = [req.query.start, req.query.end]
  } else if (req.query.start) {
    query = 'SELECT * FROM lamps WHERE date(created_at) >= ?'
    queryValue.replacements = [req.query.start]
  } else if (req.query.end) {
    query = 'SELECT * FROM lamps WHERE date(created_at) <= ?'
    queryValue.replacements = [req.query.end]
  } else {
    query = 'SELECT * FROM lamps'
  }
  sequelize.query(query, queryValue).then((lamps) => {
    res.json({'lamps': lamps})
  })
})

router.get('/lampsMcc', function (req, res, next) {
  let query
  let queryValue = {type: sequelize.QueryTypes.SELECT}
  if (req.query.start & req.query.end) {
    query = 'SELECT * FROM lamp_mccs WHERE date(created_at) >= ? AND date(created_at) <= ?'
    queryValue.replacements = [req.query.start, req.query.end]
  } else if (req.query.start) {
    query = 'SELECT * FROM lamp_mccs WHERE date(created_at) >= ?'
    queryValue.replacements = [req.query.start]
  } else if (req.query.end) {
    query = 'SELECT * FROM lamp_mccs WHERE date(created_at) <= ?'
    queryValue.replacements = [req.query.end]
  } else {
    query = 'SELECT * FROM lamp_mccs'
  }
  sequelize.query(query, queryValue).then((lampsMccs) => {
    res.json({'lampsMccs': lampsMccs})
  })
})

module.exports = router
