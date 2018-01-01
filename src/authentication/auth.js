module.exports = {
  isLoggedIn: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    } else {
      res.redirect('/login')
    }
  },
  isAuth: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    } else {
      res.status(401).json({error: 'not Auth'})
    }
  },
  isAdmin: (req, res, next) => {
    if (req.user.role_id === 'ADMIN') {
      return next()
    } else {
      res.redirect('/')
    }
  }
}
