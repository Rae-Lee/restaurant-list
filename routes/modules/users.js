const express = require('express')
const User = require('../../models/users.js')
const router = express.Router()
const passport = require('passport')
const bcrypt =require('bcryptjs')


//1. 登入頁面
router.get('/login', (req, res) => {
  res.render('login')
})

//2.註冊頁面
router.get('/register', (req, res) => {
  res.render('register')
})

//3.新增帳戶資料
router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []
  if(!email || !password || !confirmPassword){
    errors.push({message: '信箱和密碼是必填!'})
  }
  if(password !== confirmPassword){
    errors.push({message: '密碼和確認密碼不相同!'})
  }
  if(errors.length){
    return res.render('register', { errors, name, email, password, confirmPassword })
  }
  User.findOne({ email })
   .then(user => {
    if(user){
      errors.push({message: '這個信箱已經註冊過了!'})
      return res.render('register', { errors, name, email, password, confirmPassword }) 
    }
    //如果註冊成功，將密碼雜湊後儲存進資料庫
    return bcrypt.genSalt(10)
      .then(salt => bcrypt.hash(password, salt))
      .then(hash => User.create({name, email, password: hash}))
      .then(() => {
        res.redirect('/')
      })
      .catch(err => console.log(err))
  })
  .catch(err => console.log(err))
})
//4.用戶驗證
router.post('/login', 
  passport.authenticate('local', { failureRedirect: '/users/login', successRedirect: '/' })
)
//5.登出
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '已經成功登出!')
  res.redirect('/users/login')
})

module.exports = router
