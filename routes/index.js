const express = require('express')
const router = express.Router()
const sequelize = require('../models/mcc.js')

/* GET home page. */
router.get('/mcc', function (req, res, next) {
  sequelize.query('SELECT * FROM mccs WHERE date(created_at) >= ? AND date(created_at) <= ?',
    {
      replacements: [req.query.start, req.query.end], type: sequelize.QueryTypes.SELECT 
    }).then((mccs) => {
      res.json({'mccs': mccs})
    })
})

module.exports = router
