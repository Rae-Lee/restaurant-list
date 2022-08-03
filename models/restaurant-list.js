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
    type: String,
    enum: ['美式', '咖啡', '中東料理', '日本料理', '義式餐廳', '酒吧', '其他'],
    required: true
  },
  image:{
    type: String
  },
  location: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
    minLength:12,
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