module.exports = {
  'database': process.env.LAMPS_DB_PROD,
  'user': process.env.LAMPS_USER_PROD,
  'password': process.env.LAMPS_PW_PROD,
  'force': {force: false}, // force: true will drop the table if it already exists
  'cors': {
    'url': ['http://140.116.249.228', 'http://localhost:3000', 'http://localhost:8000', 'http://mosquitokiller.csie.ncku.edu.tw', 'https://mosquitokiller.csie.ncku.edu.tw', '23.22.134.98']
  },
  'sha256Secret': process.env.LAMPS_SECRET_PROD,
  'session': {
    'secret': process.env.SESSION_SECRET_PROD,
    'resave': false,
    'saveUninitialized': false,
    'cookie': {
      maxAge: 2592000000
    }
  }
}
