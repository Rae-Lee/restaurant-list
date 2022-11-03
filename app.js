// 伺服器設定
const express = require('express')
const app = express()
const dotenv = require('dotenv').config()
const port = process.env.PORT


//session生成
const session = require('express-session')
// 建立使用者認證機制
const usePassport = require('./config/passport.js')
//使用跳出訊息
const flash = require('connect-flash')
// 樣板引擎建立
const exphbs = require('express-handlebars')
// 連接資料庫
require('./config/mongoose.js')
// 複寫HTTP方法
const methodOverride = require('method-override')

// 重構路由
const routes = require('./routes')

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
// 連接靜態檔案
app.use(express.static('public'))


app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true
}))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

usePassport(app)
//儲存驗證狀態
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  next()
})
//儲存跳出訊息
app.use(flash(), (req, res, next) => {
  res.locals.warning_msg = req.flash('warning_msg')
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('error')
  next()
})
app.use(routes)
// 伺服器監聽器
app.listen(port, () => {
  console.log(`It is running on http://localhost:${port}`)
})

