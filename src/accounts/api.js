const Roles = require('./roles')
const Users = require('./users')

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

router.get('/users', Users.getAll)
router.get('/users/:id', Users.ValidateIdParams, Users.getById)
router.post('/users', Users.ValidateCreateKeys, Users.create)
router.put('/users/:id', Users.update)
router.delete('/users/:id', Users.delete)

module.exports = router
