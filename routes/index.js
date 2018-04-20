const path = require('path')
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

  app.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/login')
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
    res.redirect('/admin/places')
  })
  app.get('/admin/*', Auth.isLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname + '/../public/admin/index.html'))
  })
}
