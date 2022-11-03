const express = require('express')
const { authenticator } = require('../middleware/auth.js')
const home = require('./modules/home.js')
const restaurants = require('./modules/restaurants.js')
const users = require('./modules/users.js')
const auth = require('./modules/auth.js')
const router = express.Router()

router.use('/restaurants', authenticator, restaurants)
router.use('/users', users)
router.use('/auth', auth)
router.use('/', authenticator, home)
module.exports = router
