const LocalStrategy = require('passport-local').Strategy

const Users = require('../accounts/users')

module.exports = function (passport) {
  // =========================================================================
  // passport session setup
  // =========================================================================
  passport.serializeUser((user, done) => {
    done(null, user.user_id)
  })

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await Users.findUserByID(id)
      done(null, user.dataValues)
    } catch (err) {
      console.log(err)
    }
  })
  // ==============================
  // Login
  // ==============================
  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
    async (req, email, password, done) => {
      try {
        const user = await Users.findUserByEmail(email)
        return (!user) ? done(null, false, req.flash('loginMessage', '信箱或密碼錯誤!'))
        : (!Users.validPassword(password, user.password)) ? done(null, false, req.flash('loginMessage', '信箱或密碼錯誤!'))
                                           : done(null, user.dataValues)
      } catch (error) {
        return done(error)
      }
    }
  ))
  // // ==============================
  // // Sign up
  // // ==============================
  // passport.use(new LocalStrategy(
  //   async (email, password, done) => {
  //     try {
  //       const user = await Users.findUserByEmail(email)
  //       return (!user) ? done(null, false, { message: 'Incorrect username.' })
  //       : (!user.validPassword(password)) ? done(null, false, { message: 'Incorrect password.' })
  //                                         : done(null, user)
  //     } catch (error) {
  //       return done(error)
  //     }
  //   }
  // ))
}
