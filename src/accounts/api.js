const Roles = require('./roles')

const express = require('express')
const router = express.Router()

//
// Roles API
//
router.get('/roles', Roles.getAll)
router.get('/roles/:id', Roles.ValidateIdParams, Roles.getById)
router.post('/roles', Roles.ValidateCreateKeys, Roles.create)
router.put('/roles/:id', Roles.update)
router.delete('/roles/:id', Roles.delete)

module.exports = router
