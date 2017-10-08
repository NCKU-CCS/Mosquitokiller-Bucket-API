const Auth = require('../src/authentication/auth')

module.exports = (app, passport) => {
  // =================================
  // LOGIN
  // =================================
  app.get('/login', (req, res) => {
    res.render('login.ejs', {
      message: req.flash('loginMessage')
    })
  })

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }))

  // =================================
  // INDEX
  // =================================
  app.get('/', Auth.isLoggedIn, (req, res) => {
    res.render('index.ejs', {
      title: 'lamps'
    })
  })
}
