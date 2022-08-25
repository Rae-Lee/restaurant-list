const db = require('../../config/mongoose.js')
const restaurants = require('./../../restaurant.json')
const data = restaurants.results
const RestaurantList = require('./../restaurant-list.js')

db.once('open', () => {
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
  console.log('done')
})
