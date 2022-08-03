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
  RestaurantList.find()
    .lean()
    .then(restaurantLists => {
      res.render('index', { restaurants: restaurantLists })
    })
    .catch(error => console.log('index error'))
  
})
// 2.顯示建立餐廳的頁面
app.get('/restaurants/new', (req, res) => {
  return res.render('new')
})
// 3. 新增餐廳
app.post('/restaurants', (req, res) => {
  const information= req.body
  console.log(information)
  return RestaurantList.create(information)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))

})
// 4.顯示點選的餐廳詳細資訊
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  RestaurantList.findById(id)
    .lean()
    .then(restaurantList => {
      res.render('show', { restaurant: restaurantList })
    })       
    .catch(error => console.log('show error'))
})
// 3.顯示符合搜尋關鍵字的餐廳清單
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
