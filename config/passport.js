const passport = require('passport')
const User = require('../models/users.js')
const bcrypt = require('bcryptjs')
const dotenv = require('dotenv').config
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy

module.exports = app => {
  app.use(passport.initialize())//初始化
  app.use(passport.session())//與session同一
  //session 
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => {return done(null, user)})
      .catch(err => done(err))
  })

  //local strategy
  passport.use(new LocalStrategy(
    { usernameField: 'email', passReqToCallback: true }, (req, email, password, done) => {
      User.findOne({ email })
        .then(user => {
          if (!user) { return done(null, false, { message:'請先註冊！'}) }
          return bcrypt.compare(password, user.password)
            .then(isMatch => {
              if (!isMatch) { return done(null, false, { message: '信箱或密碼輸入不正確！' } ) }
              return done(null, user)
            })
            .catch(err => {return done(err)})
        })
        .catch(err => {return done(err)})        
  }))

  //facebook strategy
  passport.use(new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.FACEBOOK_APP_CALLBACK,
      profileFields: ['displayName', 'email']
    }, (accessToken, refreshToken, profile, done) => {
      const { name, email } = profile._json
      User.findOne({ email })
        .then(user => {
          if(user){return done(null, user)}
          const password = Math.random().toString(36).slice(-8)
          return bcrypt.genSalt(10)
            .then(salt => bcrypt.hash( password, salt))
            .then(hash => {
              User.create({name, email, password: hash})
                .then(user => {return done(null, user)})
                .catch(err => done(err))
            })
            .catch(err => done(err))
        })
        .catch(err => done(err))
    }
  ))
}
