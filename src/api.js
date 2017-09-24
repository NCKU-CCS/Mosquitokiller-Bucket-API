const Places = require('./lampPlaces/places')
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

// //
// // Lamps API
// //

// router.get('/places', Places.getAll)
// router.get('/places/:id', Places.getById)
// router.post('/places', Places.create)
// router.put('/places/:id', Places.update)
// router.delete('/places/:id', Places.delete)

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
// Mccs API
//
router.get('/mcc', Mcc.getAll)
router.get('/mcc/:id', Mcc.getById)
router.post('/mcc', Mcc.create)
router.put('/mcc/:id', Mcc.update)
router.delete('/mcc/:id', Mcc.delete)

//
// Rules API
// //
router.get('/rules', Rules.getAll)
router.get('/rules/:id', Rules.getById)
router.post('/rules', Rules.create)
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
