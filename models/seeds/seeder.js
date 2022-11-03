const db = require('../../config/mongoose.js')
const restaurants = require('./../../restaurant.json').results
const users = require('./../../user.json').results
const bcrypt = require('bcryptjs')
const RestaurantList = require('./../restaurant-list.js')
const User = require('./../users.js')
db.once('open', () => {
  Promise.all(
    users.map((user, index) => {
      const { name, email, password } = user 
      return bcrypt.genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => User.create({ name, email, 'password': hash }))
        .then(user => {
          const userRestaurants = []
          for (let i = 0; i < 3; i++) {
            restaurants[index * 3 + i].userId = user._id
            userRestaurants.push(restaurants[index * 3 + i])
          }
          return RestaurantList.create(userRestaurants)
            .then(() => console.log('restaurants created'))
            .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
    }) 
  ).then(() => {
    console.log('done')
    process.exit()
  })
  .catch(err => console.log(err))
})
