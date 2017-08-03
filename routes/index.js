const express = require('express')
const router = express.Router()
const mccs = require('../models/mcc.js')

/* GET home page. */
router.get('/', function (req, res, next) {
  mccs.findAll({
    attributes: ['index', 'created_at', 'mcc_keys', 'mcc_lists', 'distance', 'timeline', 'point_counts', 'up_limit'],
    where: {
      distance: 1000
    }
  })
  .then(mccs => {
    res.json({'mccs': mccs})
  })
})

module.exports = router
