const Auth = require('../authentication/auth')

const Places = require('./lampPlaces')
const Lamps = require('./lamps')
const Counts = require('./lampCounts')
const States = require('./lampStates')

const Rules = require('./lampMccRules')
const Mcc = require('./lampMcc')

const Comments = require('./lampComments')

const express = require('express')
const router = express.Router()

//
// Places API
//
router.get('/places', Places.getAll)
router.get('/places/:id', Places.ValidateIdParams, Places.getById)
router.post('/places', Auth.isLoggedIn, Places.ValidateCreateKeys, Places.create)
router.put('/places/:id', Auth.isLoggedIn, Places.update)
router.delete('/places/:id', Auth.isLoggedIn, Places.delete)

//
// Lamps API
//

router.get('/lamps', Lamps.getAll)
router.get('/lamps/:id', Lamps.ValidateIdParams, Lamps.getById)
router.post('/lamps', Auth.isLoggedIn, Lamps.ValidateCreateKeys, Lamps.create)
router.put('/lamps/:id', Auth.isLoggedIn, Lamps.update)
router.delete('/lamps/:id', Auth.isLoggedIn, Lamps.delete)

//
// Counts API
//
router.get('/counts', Counts.getAll)
router.get('/counts/:id', Counts.ValidateIdParams, Counts.getById)
router.post('/counts', Auth.isLoggedIn, Counts.ValidateCreateKeys, Counts.create)
router.put('/counts/:id', Auth.isLoggedIn, Counts.update)
router.delete('/counts/:id', Auth.isLoggedIn, Counts.delete)

//
// States API
//
router.get('/states', States.getAll)
router.get('/states/:id', States.ValidateIdParams, States.getById)
router.post('/states', Auth.isLoggedIn, States.ValidateCreateKeys, States.create)
router.put('/states/:id', Auth.isLoggedIn, States.update)
router.delete('/states/:id', Auth.isLoggedIn, States.delete)

//
// Mcc API
//
router.get('/mcc', Mcc.getAll)
router.get('/mcc/:id', Mcc.ValidateIdParams, Mcc.getById)
router.post('/mcc', Auth.isLoggedIn, Mcc.ValidateCreateKeys, Mcc.create)
router.put('/mcc/:id', Auth.isLoggedIn, Mcc.update)
router.delete('/mcc/:id', Auth.isLoggedIn, Mcc.delete)

//
// Rules API
//
router.get('/rules', Rules.getAll)
router.get('/rules/:id', Rules.ValidateIdParams, Rules.getById)
router.post('/rules', Auth.isLoggedIn, Rules.ValidateCreateKeys, Rules.create)
router.put('/rules/:id', Auth.isLoggedIn, Rules.update)
router.delete('/rules/:id', Auth.isLoggedIn, Rules.delete)

//
// Comments API
//
router.get('/comments', Auth.isLoggedIn, Comments.getAll)
router.get('/comments/:id', Auth.isLoggedIn, Comments.ValidateIdParams, Comments.getById)
router.post('/comments', Comments.ValidateCreateKeys, Comments.create)
router.put('/comments/:id', Auth.isLoggedIn, Comments.update)
router.delete('/comments/:id', Auth.isLoggedIn, Comments.delete)

module.exports = router
