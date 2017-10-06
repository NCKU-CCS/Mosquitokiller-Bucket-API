const basePath = './lampAPI'
const Places = require(`${basePath}/lampPlaces/places`)
const Lamps = require(`${basePath}/lamps/lamps`)
const Counts = require(`${basePath}/lampCounts/counts`)
const States = require(`${basePath}/lampStates/states`)

const Rules = require(`${basePath}/lampMccRules/rules`)
const Mcc = require(`${basePath}/lampMcc/mcc`)

const Comments = require(`${basePath}/lampComments/comments`)

const express = require('express')
const router = express.Router()

//
// Places API
//
router.get('/places', Places.getAll)
router.get('/places/:id', Places.ValidateIdParams, Places.getById)
router.post('/places', Places.ValidateCreateKeys, Places.create)
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

//
// Counts API
//
router.get('/counts', Counts.getAll)
router.get('/counts/:id', Counts.ValidateIdParams, Counts.getById)
router.post('/counts', Counts.ValidateCreateKeys, Counts.create)
router.put('/counts/:id', Counts.update)
router.delete('/counts/:id', Counts.delete)

//
// States API
//
router.get('/states', States.getAll)
router.get('/states/:id', States.ValidateIdParams, States.getById)
router.post('/states', States.ValidateCreateKeys, States.create)
router.put('/states/:id', States.update)
router.delete('/states/:id', States.delete)

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
router.get('/comments', Comments.getAll)
router.get('/comments/:id', Comments.ValidateIdParams, Comments.getById)
router.post('/comments', Comments.ValidateCreateKeys, Comments.create)
router.put('/comments/:id', Comments.update)
router.delete('/comments/:id', Comments.delete)

module.exports = router
