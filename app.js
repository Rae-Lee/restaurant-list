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
require('./config/mongoose.js')
// 複寫HTTP方法
const methodOverride = require('method-override')
// 重構路由
const routes = require('./routes')
//上傳圖片設定
const multer = require('multer')

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(routes)

// 伺服器監聽器
app.listen(port, () => {
  console.log(`It is running on http://localhost:${port}`)
})

