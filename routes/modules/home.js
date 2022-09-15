const express = require('express')
const RestaurantList = require('../../models/restaurant-list.js')
const router = express.Router()
const port = 3000

// 1.顯示首頁清單
router.get('/', (req, res) => {
  return RestaurantList.find()
    .lean()
    .then(restaurants => {
      res.render('index', { restaurants })
    })
    .catch(error => {
      return res.render('error')
    })
})
// 2.顯示符合搜尋關鍵字的餐廳清單
router.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim()
  if (!keyword) {
    return res.redirect('/')
  }
  return RestaurantList.find().or([{ 'name': { $regex: keyword, $options: '$i' } }, { 'name_en': { $regex: keyword, $options: '$i' } }, { 'category': { $regex: keyword, $options: '$i' } }])
    .lean()
    .then(restaurants => {
      if (!restaurants.length){
        return res.render('index', { notFoundMessage: '<h5 class="text-center mt-3">搜尋不到任何餐廳</h5>' })
      }
      return res.render('index', { restaurants })
    })
    .catch(error => {
      return res.render('error')
    })
})
module.exports = router
