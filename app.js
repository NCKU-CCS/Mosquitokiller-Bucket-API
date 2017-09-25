const express = require('express')
const path = require('path')                      // path of directory
const favicon = require('serve-favicon')
const logger = require('morgan')                  // log
const cookieParser = require('cookie-parser')     // use in session token
const bodyParser = require('body-parser')         // Parse Request
const compression = require('compression')        // Gzip
const cors = require('cors')

// ###################################
// EXPRESS SETUP
// ###################################

const app = express()

const CONFIG = (process.env.NODE_ENV === 'production')
? require('../config/lampProdConfig.js')
: require('../config/lampDevConfig.js')

// set up cors config
const corsOptions = {
  origin: CONFIG.cors.url,
  optionsSucccessCode: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204 
  credentials: true
}

global.ROOT_PATH = path.resolve(__dirname)

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

// ###################################
// EXPRESS MIDDLEWARE
// ###################################
// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
// app.use(express.static(path.join(__dirname, 'public')))

app.use(compression())               // enable Gzip
app.use('/', cors(corsOptions))      // support cors request

// ###################################
// Route SETUP
// ###################################
// const index = require('./routes/index')
// app.use('/api', index)

const apis = require('./src/api.js')
app.use('/apis', apis)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
