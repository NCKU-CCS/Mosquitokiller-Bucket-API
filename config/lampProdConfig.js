module.exports = {
  'database': process.env.LAMPS_DB_PROD,
  'user': process.env.LAMPS_USER_PROD,
  'password': process.env.LAMPS_PW_PROD,
  'force': {force: false}, // force: true will drop the table if it already exists
  'cors': {
    'url': [process.env.LAMPS_CORS_PROD]
  },
  'sha256Secret': process.env.LAMPS_SECRET_PROD
}
