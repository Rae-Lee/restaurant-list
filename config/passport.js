const passport = require('passport')
const User = require('../models/users.js')
const bcrypt = require('bcryptjs')
const LocalStrategy = require('passport-local').Strategy

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
    { usernameField: 'email' }, (email, password, done) => {
      User.findOne({ email })
        .then(user => {
          if (!user) { return done(null, false) }
          return bcrypt.compare(password, user.password)
            .then(isMatch => {
              if (!isMatch) { return done(null, false) }
              return done(null, user)
            })
            .catch(err => {return done(err)})
        })
        .catch(err => {return done(err)})        
  }))
}
