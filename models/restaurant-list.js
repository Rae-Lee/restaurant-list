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
    enum: ['美式', '咖啡', '中東料理', '日本料理', '義式餐廳', '酒吧', '其他' ]
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
  description: { type: String },
  American: {
    type: Boolean,
    default:false
  },
  cafe: {
    type: Boolean,
    default: false
  },
  MiddleEastern: {
    type: Boolean,
    default: false
  },
  Japanese: {
    type: Boolean,
    default: false
  },
  pub: {
    type: Boolean,
    default: false
  },
  Italian: {
    type: Boolean,
    default: false
  },
  other: {
    type: Boolean,
    default: false
  }
})

module.exports = mongoose.model('RestaurantList', restaurantListSchema) 