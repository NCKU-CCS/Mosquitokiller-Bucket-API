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
router.post('/places', Auth.isAuth, Places.ValidateCreateKeys, Places.create)
router.put('/places/:id', Auth.isAuth, Places.update)
router.delete('/places/:id', Auth.isAuth, Places.delete)

//
// Lamps API
//

router.get('/lamps', Lamps.getAll)
router.get('/lamps/:id', Lamps.ValidateIdParams, Lamps.getById)
router.post('/lamps', Auth.isAuth, Lamps.ValidateCreateKeys, Lamps.create)
router.put('/lamps/:id', Auth.isAuth, Lamps.update)
router.delete('/lamps/:id', Auth.isAuth, Lamps.delete)

//
// Counts API
//
router.get('/counts', Counts.getAll)
router.get('/counts/:id', Counts.ValidateIdParams, Counts.getById)
router.post('/counts', Auth.isAuth, Counts.ValidateCreateKeys, Counts.create)
router.put('/counts/:id', Auth.isAuth, Counts.update)
router.delete('/counts/:id', Auth.isAuth, Counts.delete)

//
// States API
//
router.get('/states', States.getAll)
router.get('/states/:id', States.ValidateIdParams, States.getById)
router.post('/states', Auth.isAuth, States.ValidateCreateKeys, States.create)
router.put('/states/:id', Auth.isAuth, States.update)
router.delete('/states/:id', Auth.isAuth, States.delete)

//
// Mcc API
//
router.get('/mcc', Mcc.getAll)
router.get('/mcc/:id', Mcc.ValidateIdParams, Mcc.getById)
router.post('/mcc', Auth.isAuth, Mcc.ValidateCreateKeys, Mcc.create)
router.put('/mcc/:id', Auth.isAuth, Mcc.update)
router.delete('/mcc/:id', Auth.isAuth, Mcc.delete)

//
// Rules API
//
router.get('/rules', Rules.getAll)
router.get('/rules/:id', Rules.ValidateIdParams, Rules.getById)
router.post('/rules', Auth.isAuth, Rules.ValidateCreateKeys, Rules.create)
router.put('/rules/:id', Auth.isAuth, Rules.update)
router.delete('/rules/:id', Auth.isAuth, Rules.delete)

//
// Comments API
//
router.get('/comments', Auth.isAuth, Comments.getAll)
router.get('/comments/:id', Auth.isAuth, Comments.ValidateIdParams, Comments.getById)
router.post('/comments', Comments.ValidateCreateKeys, Comments.create)
router.put('/comments/:id', Auth.isAuth, Comments.update)
router.delete('/comments/:id', Auth.isAuth, Comments.delete)

module.exports = router
