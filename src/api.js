const Places = require('./lampPlaces/places')
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

module.exports = router
