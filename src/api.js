const Places = require('./lampPlaces/places')
const Lamps = require('./lamps/lamps')
const Rules = require('./lampMccRules/rules')
const Mcc = require('./lampMcc/mcc')
const express = require('express')
const router = express.Router()

//
// Places API
//
router.get('/places', Places.getAll)
router.get('/places/:id', Places.getById)
router.post('/places', Places.create)
router.put('/places/:id', Places.update)
router.delete('/places/:id', Places.delete)

//
// Lamps API
//

router.get('/lamps', Lamps.getAll)
router.get('/lamps/:id', Lamps.ValidateIdParams, Lamps.getById)
router.post('/lamps', Lamps.ValidateCreateKeys, Lamps.create)
router.put('/lamps/:id', Lamps.update)
router.delete('/lamps/:id', Lamps.delete)

// //
// // Counts API
// //
// router.get('/places', Places.getAll)
// router.get('/places/:id', Places.getById)
// router.post('/places', Places.create)
// router.put('/places/:id', Places.update)
// router.delete('/places/:id', Places.delete)

//
// States API
//
// router.get('/places', Places.getAll)
// router.get('/places/:id', Places.getById)
// router.post('/places', Places.create)
// router.put('/places/:id', Places.update)
// router.delete('/places/:id', Places.delete)

//
// Mcc API
//
router.get('/mcc', Mcc.getAll)
router.get('/mcc/:id', Mcc.ValidateIdParams, Mcc.getById)
router.post('/mcc', Mcc.ValidateCreateKeys, Mcc.create)
router.put('/mcc/:id', Mcc.update)
router.delete('/mcc/:id', Mcc.delete)

//
// Rules API
//
router.get('/rules', Rules.getAll)
router.get('/rules/:id', Rules.ValidateIdParams, Rules.getById)
router.post('/rules', Rules.ValidateCreateKeys, Rules.create)
router.put('/rules/:id', Rules.update)
router.delete('/rules/:id', Rules.delete)

//
// Comments API
//
// router.get('/places', Places.getAll)
// router.get('/places/:id', Places.getById)
// router.post('/places', Places.create)
// router.put('/places/:id', Places.update)
// router.delete('/places/:id', Places.delete)

module.exports = router
