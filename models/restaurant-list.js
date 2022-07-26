const mongoose = require('mongoose')
const Schema = mongoose.Schema
const restaurantListSchema = new Schema({
  name:{
    type:string,
    required:true
  }
})

module.exports = mongoose.model('RestaurantList', restaurantListSchema) 