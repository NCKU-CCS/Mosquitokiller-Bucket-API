module.exports = {
  isLoggedIn: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    } else {
      res.redirect('/login')
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
