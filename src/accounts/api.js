const Auth = require('../authentication/auth')

const Roles = require('./roles')
const Users = require('./users')

const express = require('express')
const router = express.Router()

//
// Roles API
//
router.get('/roles', Auth.isLoggedIn, Auth.isAdmin, Roles.getAll)
router.get('/roles/:id', Auth.isLoggedIn, Auth.isAdmin, Roles.ValidateIdParams, Roles.getById)
router.post('/roles', Auth.isLoggedIn, Auth.isAdmin, Roles.ValidateCreateKeys, Roles.create)
router.put('/roles/:id', Auth.isLoggedIn, Auth.isAdmin, Roles.update)
router.delete('/roles/:id', Auth.isLoggedIn, Auth.isAdmin, Roles.delete)

router.get('/users', Auth.isLoggedIn, Auth.isAdmin, Users.getAll)
router.get('/users/:id', Auth.isLoggedIn, Auth.isAdmin, Users.ValidateIdParams, Users.getById)
router.post('/users', Auth.isLoggedIn, Auth.isAdmin, Users.ValidateCreateKeys, Users.create)
router.put('/users/:id', Auth.isLoggedIn, Auth.isAdmin, Users.update)
router.delete('/users/:id', Auth.isLoggedIn, Auth.isAdmin, Users.delete)

module.exports = router
