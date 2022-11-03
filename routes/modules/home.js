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
  let findLocation = { userId }
  let findKeyword = []
  if (!keyword && !location) {
    return res.redirect('/')
  }
  if(!location){
    findKeyword = [{ 'name': { $regex: keyword, $options: '$i' } }, { 'name_en': { $regex: keyword, $options: '$i' } }, { 'category': { $regex: keyword, $options: '$i' } }]
  }
  else if(!keyword){
    findLocation = { userId, 'location': { $regex: location, $options: '$i' } }
    findKeyword = [{ 'rating': {'$gt': 4}}]
  }else{
    findLocation = { userId, 'location': { $regex: location, $options: '$i' } }
    findKeyword = [{ 'name': { $regex: keyword, $options: '$i' } }, { 'name_en': { $regex: keyword, $options: '$i' } }, { 'category': { $regex: keyword, $options: '$i' } }]
  }
  return RestaurantList.find(findLocation).or(findKeyword)
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
  let isPrice = true
  let isRate = true
  let sortRating = {}
  let findLocation = { userId }
  let findPrice = {}
  let findKeyword = []
  if(!rate && !price){
    const url = urlPath
    return res.redirect(url)
  }
  if(!rate){
    urlPathRate = urlPath + '&' + 'price' + '=' + price
    isRate = false
    findPrice = { price }
  }else if(!price){
    urlPathPrice = urlPath + '&' + 'rate' + '=' + rate
    isPrice = false
    sortRating = { 'rating': rate }
  }else{
    urlPathRate = urlPath + '&' + 'price' + '=' + price
    urlPathPrice = urlPath + '&' + 'rate' + '=' + rate
    sortRating = { 'rating': rate }
    findPrice = { price }
  }
  if (!keyword && !location) {
    return res.redirect('/')
  }
  if (!location) {
    findKeyword = [{ 'name': { $regex: keyword, $options: '$i' } }, { 'name_en': { $regex: keyword, $options: '$i' } }, { 'category': { $regex: keyword, $options: '$i' } }]
  }
  else if (!keyword) {
    findLocation = { userId, 'location': { $regex: location, $options: '$i' } }
    findKeyword = [{ 'rating': { '$gt': 4 } }]
  } else {
    findLocation = { userId, 'location': { $regex: location, $options: '$i' } }
    findKeyword = [{ 'name': { $regex: keyword, $options: '$i' } }, { 'name_en': { $regex: keyword, $options: '$i' } }, { 'category': { $regex: keyword, $options: '$i' } }]
  }
  RestaurantList.find(findLocation).find(findPrice).or(findKeyword)
    .sort(sortRating)    
    .lean() 
    .then(restaurants => {
      if (!restaurants.length) {
        return res.render('index', { notFoundMessage: '<div class="notfound"><h5 class="text-center">搜尋不到任何餐廳</h5></div>' })
      }
      return res.render('index', { restaurants, isSearched: true, urlPathRate, urlPathPrice, isRate, isPrice })
    })
    .catch(error => {
      return res.render('error')
    })
})
module.exports = router
