
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

  // // =================================
  // // SIGN UP
  // // =================================
  // app.get('/signup', (req, res) => {
  //   res.render('signup.ejs', {
  //     message: req.flash('signupMessage')
  //   })
  // })

  // app.post('/local-signup', passport.authenticate('local-signup', {
  //   successRedirect: '/',
  //   failureRedirect: '/signup',
  //   failureFlash: true
  // }))

  // =================================
  // INDEX
  // =================================
  app.get('/', (req, res) => {
    res.render('index.ejs', {
      title: 'lamps'
    })
  })
}
