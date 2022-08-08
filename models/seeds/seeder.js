const mongoose = require('mongoose')
const restaurants = require('./../../restaurant.json')
const data = restaurants.results
const RestaurantList = require('./../restaurant-list.js')
const dotenv = require('dotenv').config()
mongoose.connect(process.env.MONGODB_URI)


const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error')
})
db.once('open', () => {
  console.log('mongodb connected!')
  data.forEach(d => {
    d.American = d.category === '美式'
    d.cafe = d.category === '咖啡'
    d.MiddleEastern = d.category === '中東料理'
    d.Japanese = d.category === '日本料理'
    d.Italian = d.category === '義式餐廳'
    d.pub = d.category === '酒吧'
    d.other = d.category === '其他'

    RestaurantList.create(d)
  })
})

