const express = require('express')
const RestaurantList = require('../../models/restaurant-list.js')
const router = express.Router()

// 1.顯示首頁清單
router.get('/', (req, res) => { 
  const userId = req.user._id
 RestaurantList.find({ userId })
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
  const userId = req.user._id
  const keyword = req.query.keyword || ''
  const location = req.query.location || ''
  const urlPathRate = '/' + 'search' + '?' + 'keyword' + '=' + keyword + '&' + 'location' + '=' + location
  const urlPathPrice = urlPathRate
  const selectParams = { userId }
  if (!keyword && !location) {
    return res.redirect('/')
  }
  if(keyword){
    selectParams.$or = [{ 'name': { $regex: keyword, $options: '$i' } }, { 'name_en': { $regex: keyword, $options: '$i' } }, { 'category': { $regex: keyword, $options: '$i' } }]
  }
  if(location){
    selectParams.location = { $regex: location, $options: '$i' }
  }
  return RestaurantList.find(selectParams)
    .lean()
    .then(restaurants => {
      if (!restaurants.length){
        return res.render('index', { notFoundMessage: '<div class="notfound"><h5 class="text-center">搜尋不到任何餐廳</h5></div>' })
      }
      return res.render('index', { restaurants, isSearched: true, keyword, location, urlPathRate, urlPathPrice })
    })
    .catch(error => {
      return res.render('error')
    })
})
//3.顯示按照評分或價格排列的餐廳
router.post('/search', (req, res) => {
  const userId = req.user._id
  const rate = req.body.rate || req.query.rate
  const price = req.body.price || req.query.price
  const location = req.query.location || ''
  const keyword = req.query.keyword || ''
  const urlPath = '/' + 'search' + '?' + 'keyword' + '=' + keyword + '&' + 'location' + '=' + location
  let urlPathRate = urlPath
  let urlPathPrice = urlPath
  let isSelectedPrice = false
  let isSelectedRate = false
  const sortParams = {}
  const selectParams = { userId }
  if (!keyword && !location) {
    return res.redirect('/')
  }
  if(!rate && !price){
    const url = urlPath
    return res.redirect(url)
  }
  if (keyword) {
    selectParams.$or = [{ 'name': { $regex: keyword, $options: '$i' } }, { 'name_en': { $regex: keyword, $options: '$i' } }, { 'category': { $regex: keyword, $options: '$i' } }]
  }
  if (location) {
    selectParams.location = { $regex: location, $options: '$i' }
  }
  if (price) {
    selectParams.price = price 
    urlPathRate = urlPath + '&' + 'price' + '=' + price
    isSelectedPrice = true
  }
  if (rate) {
    sortParams.rating = rate
    urlPathPrice = urlPath + '&' + 'rate' + '=' + rate
    isSelectedRate = true
  }
  RestaurantList.find(selectParams)
    .sort(sortParams)    
    .lean() 
    .then(restaurants => {
      if (!restaurants.length) {
        return res.render('index', { notFoundMessage: '<div class="notfound"><h5 class="text-center">搜尋不到任何餐廳</h5></div>' })
      }
      return res.render('index', { restaurants, isSearched: true, urlPathRate, urlPathPrice, isSelectedRate, isSelectedPrice })
    })
    .catch(error => {
      return res.render('error')
    })
})
module.exports = router
