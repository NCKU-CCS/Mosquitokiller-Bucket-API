module.exports = {
  'database': process.env.LAMPS_DB_DEV,
  'user': process.env.LAMPS_USER_DEV,
  'password': process.env.LAMPS_PW_DEV,
  'force': {force: true}, // force: true will drop the table if it already exists,
  'cors': {
    'url': ['http://localhost:3000']
  },
  'sha256Secret': process.env.LAMPS_SECRET_DEV,
  'session': {
    'secret': process.env.SESSION_SECRET_DEV,
    'resave': false,
    'saveUninitialized': false,
    'cookie': {
      maxAge: 2592000000
    }
  }
}
