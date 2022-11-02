const mongoose = require('mongoose')
const Schema = mongoose.Schema
const restaurantListSchema = new Schema({
  id: { type: Number },
  name: {
    type: String,
    required: true
  },
  name_en: { type: String },
  location: {
    type: String,
    required: true
  },
  google_map: {
    type: String
  },
  phone: {
    type: String,
    maxLength: 12
  },
  image: {
    type: String
  },
  category: { 
    type: String,
    enum: ['台式', '美式', '咖啡', '中東料理', '日本料理', '義式餐廳', '酒吧', '其他']
  },
  price: {
    type: String
  },  
  rating: {
    type: Number,
    min: 4,
    max: 5
  },
  description: { type: String },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true
  }
})

module.exports = mongoose.model('RestaurantList', restaurantListSchema) 
