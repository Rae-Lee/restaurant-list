const express = require('express')
const RestaurantList = require('../../models/restaurant-list.js')
const router = express.Router()

// 1.顯示首頁清單
router.get('/', (req, res) => {
  return RestaurantList.find()
    .lean()
    .then(restaurants => {
      res.render('index', { restaurants })
    })
    .catch(error => console.log(error))
})

module.exports = router
