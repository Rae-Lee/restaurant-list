// 伺服器設定
const express = require('express')
const app = express()
const port = 3000

// 樣板引擎建立
const exphbs = require('express-handlebars')
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// 連接靜態檔案
app.use(express.static('public'))

// 連接資料庫
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()
const RestaurantList = require('./models/restaurant-list.js')
mongoose.connect(process.env.MONGODB_URI)
const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error')
})
db.once('open', () => {
  console.log('mongodb connected!')
})

// 載入上傳圖片套件
const multer = require('multer')
const upload = multer()

app.use(express.urlencoded({ extended:true }))

// 1.顯示首頁清單
app.get('/', (req, res) => {
  return RestaurantList.find()
    .lean()
    .then(restaurants => {
      res.render('index', { restaurants })
    })
    .catch(error => console.log(error))
  
})
// 2.顯示建立餐廳的頁面
app.get('/restaurants/new', (req, res) => {
  return res.render('new')
})
// 3. 新增餐廳
app.post('/restaurants', (req, res) => {
  const restaurant = req.body
  const category = req.body.category
  restaurant.American = category === '美式'
  restaurant.cafe = category === '咖啡'
  restaurant.MiddleEastern = category === '中東料理'
  restaurant.Japanese = category === '日本料理'
  restaurant.Italian = category === '義式餐廳'
  restaurant.pub = category === '酒吧'
  restaurant.other = category === '其他'

  return RestaurantList.create(restaurant)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// 4.顯示點選的餐廳詳細資訊頁面
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return RestaurantList.findById(id)
    .lean()
    .then(restaurant => {
      res.render('show', { restaurant })
    })       
    .catch(error => console.log(error))
})

// 5. 顯示編輯餐廳的頁面
app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  return RestaurantList.findById(id)
    .lean()
    .then(restaurant => {
      res.render('edit', { restaurant })
    })
    .catch(error => console.log(error))
})

// 6. 編輯餐廳
app.post('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  const { name, name_en, location, google_map, phone, image, category, description } = req.body
  return RestaurantList.findById(id)
    .then(restaurant => {
      restaurant.name = name
      restaurant.name_en = name_en
      restaurant.location = location
      restaurant.google_map = google_map
      restaurant.phone = phone
      restaurant.category = category
      restaurant.image = image
      restaurant.description = description
      restaurant.American = category === '美式'
      restaurant.cafe = category === '咖啡'
      restaurant.MiddleEastern = category === '中東料理'
      restaurant.Japanese = category === '日本料理'
      restaurant.Italian = category === '義式餐廳'
      restaurant.pub = category === '酒吧'
      restaurant.other = category === '其他'
      return restaurant.save()
    })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
}) 

// 7. 刪除餐廳
app.post('/restaurants/:id/delete', (req, res) => {
  const id = req.params.id
  return RestaurantList.findById(id)
    .then(restaurant => {
      restaurant.remove()
    })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
}) 
// 8.顯示符合搜尋關鍵字的餐廳清單
app.get('/search', (req, res) => {
  const keyword = req.query.keyword.toLowerCase()
  const searchRestaurants = restaurants.filter(d => {
    return d.name.toLowerCase().includes(keyword) || d.name_en.toLowerCase().includes(keyword) || d.category.toLowerCase().includes(keyword)
  })
  res.render('index', { restaurants: searchRestaurants })
})


// 伺服器監聽器
app.listen(port, () => {
  console.log(`It is running on http://localhost:${port}`)
})
