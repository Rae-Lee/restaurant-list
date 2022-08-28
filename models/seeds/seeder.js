const db = require('../../config/mongoose.js')
const restaurants = require('./../../restaurant.json')
const data = restaurants.results
const RestaurantList = require('./../restaurant-list.js')

db.once('open', () => {
  data.forEach(d => {
    RestaurantList.create(d)
  })
  console.log('done')
})
