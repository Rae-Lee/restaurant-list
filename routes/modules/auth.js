const express = require('express')
const passport = require('passport')
const router = express.Router()

//自facebook獲取資料
router.get('/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] })
)
//facebook 登入 callback
router.get('/facebook/callback', passport.authenticate('facebook', {failureRedirect: '/users/login', successRedirect: '/'}))
module.exports = router