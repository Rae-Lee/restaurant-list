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
    RestaurantList.create(d)
  })
})

