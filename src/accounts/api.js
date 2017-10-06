const Permissions = require('./permissions/permissions')

const express = require('express')
const router = express.Router()

//
// Permissions API
//
router.get('/permissions', Permissions.getAll)
router.get('/permissions/:id', Permissions.ValidateIdParams, Permissions.getById)
router.post('/permissions', Permissions.ValidateCreateKeys, Permissions.create)
router.put('/permissions/:id', Permissions.update)
router.delete('/permissions/:id', Permissions.delete)

module.exports = router
