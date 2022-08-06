const mongoose = require('mongoose')
const Schema = mongoose.Schema
const restaurantListSchema = new Schema({
  id:{ type: Number },
  name:{
    type: String,
    required: true
  },
  name_en:{ type: String },
  category:{ 
    type: String
  },
  image:{
    type: String,
    required:true
  },
  location: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
    maxLength:12
  },
  google_map: {
    type: String
  },
  rating: {
    type: Number,
    min:0,
    max:5
  },
  description: { type: String }
})

module.exports = mongoose.model('RestaurantList', restaurantListSchema) 