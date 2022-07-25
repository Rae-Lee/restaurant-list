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

// 顯示動態資料
const data = require('./restaurant.json')
const restaurants = data.results

// 1.顯示首頁清單
app.get('/', (req, res) => {
  res.render('index', { restaurants })
})
// 2.顯示點選的餐廳詳細資訊
app.get('/restaurants/:id', (req, res) => {
  const restaurant = restaurants.find(d => d.id.toString() === req.params.id)
  res.render('show', { restaurant })
})
// 3.顯示符合搜尋關鍵字的餐廳清單
app.get('/search', (req, res) => {
  const keyword = req.query.keyword.toLowerCase()
  const searchRestaurants = restaurants.filter(d => {
    return d.name.toLowerCase().includes(keyword) || d.name_en.toLowerCase().includes(keyword) || d.category.toLowerCase().includes(keyword)
  })
  res.render('index', { restaurants:searchRestaurants })
})

// 伺服器監聽器
app.listen(port, () => {
  console.log(`It is running on http://localhost:${port}`)
})
