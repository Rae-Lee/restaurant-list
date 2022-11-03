const express = require('express')
const RestaurantList = require('../../models/restaurant-list.js')//mongoDB schema
const router = express.Router()
const dotenv = require('dotenv').config()
const port = process.env.PORT
const upload = require('../../config/multer.js')
const imageFile = 'uploadImage'//照片上傳儲存資料夾
// 1.顯示建立餐廳的頁面
router.get('/new', (req, res) => {
  const GOOGLE_KEY = process.env.GOOGLE_KEY
  return res.render('new', { GOOGLE_KEY })
})
// 2. 新增餐廳
router.post('/', upload.single('image'), (req, res) => {
  const url = req.protocol + '://' + req.hostname + ':' + port + '/'
  const restaurant = JSON.parse(JSON.stringify(req.body))//文字資料回傳
  //如果有上傳照片
  if (req.file){
    const image = `${url}${imageFile}/${req.file.filename}`//圖片URL回傳
    restaurant.image = image//加入req.body回傳資料中
  }  
  restaurant.userId = req.user._id
  const restaurantList = new RestaurantList({})//建立一筆新的餐廳資料
  Object.assign(restaurantList, restaurant)
  return restaurantList.save()
    .then(() => res.redirect('/'))
    .catch(error => {
      return res.render('error')
    })
})

// 4.顯示點選的餐廳詳細資訊頁面
router.get('/:id', (req, res) => {
  const _id = req.params.id
  const userId = req.user._id
  return RestaurantList.findOne({userId, _id})
    .lean()
    .then(restaurant => {
      res.render('show', { restaurant })
    })
    .catch(error => {
      return res.render('error')
    })
})

// 5. 顯示編輯餐廳的頁面
router.get('/:id/edit', (req, res) => {
  const _id = req.params.id
  const userId = req.user._id
  const isSelected = {}//宣告物件
  return RestaurantList.findOne({userId, _id})
    .lean()
    .then(restaurant => {
        //若餐廳係某個特定的類別，則在物件中增加該類別為屬性並將值設定為1
      const category = restaurant.category
      const price = restaurant.price
      switch (category) {
        case '台式':
          isSelected.Taiwanese = 1
          break;
        case '美式':  
          isSelected.American = 1
          break;
        case '咖啡': 
          isSelected.cafe = 1
          break;
        case '中東料理':  
          isSelected.MiddleEastern = 1
          break;
        case '日本料理':  
          isSelected.Japanese = 1
          break;
        case '義式餐廳':  
          isSelected.Italian = 1
          break;
        case '酒吧':  
          isSelected.pub = 1
          break;
        case '其他':  
          isSelected.other = 1
          break;
      }
      switch (price) {
        case '$100以下':
          isSelected.hundred = 1
          break;
        case '$100-$300':
          isSelected.aboveHundred = 1
          break;
        case '$300-$1000':
          isSelected.thousand = 1
          break;
        case '$1000以上':
          isSelected.aboveThousand = 1
          break;
      }
      res.render('edit', { restaurant, isSelected })
    })
    .catch(error => {
      return res.render('error')
    })
})

// 6. 編輯餐廳
router.put('/:id', (req, res) => {
  const _id = req.params.id
  const userId = req.user._id
  const { name, name_en, location, google_map, phone, image, category, price, rating } = req.body
  return RestaurantList.findOne({userId, _id})
    .then(restaurant => {
      restaurant.name = name
      restaurant.name_en = name_en
      restaurant.location = location
      restaurant.google_map = google_map
      restaurant.phone = phone
      restaurant.image = image
      restaurant.category = category
      restaurant.price = price
      restaurant.rating = rating
      restaurant.markModified('name')
      restaurant.markModified('name_en')
      restaurant.markModified('location')
      restaurant.markModified('google_map')
      restaurant.markModified('phone')
      restaurant.markModified('image')
      restaurant.markModified('category')
      restaurant.markModified('price')
      restaurant.markModified('rating')
      return restaurant.save()
    })
    .then(() => {
      res.redirect('/')
    })
    .catch(error => {
      return res.render('error')
    })
})

// 7. 刪除餐廳
router.delete('/:id', (req, res) => {
  const _id = req.params.id
  const userId = req.user._id
  return RestaurantList.findOne({userId, id})
    .then(restaurant => {
      restaurant.remove()
    })
    .then(() => res.redirect('/'))
    .catch(error => {
      return res.render('error')
    })
})


module.exports = router
