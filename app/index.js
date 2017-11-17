const express = require('express')
const bodyParser = require('body-parser')
const moment = require('moment')
const debug = require('debug')('app')

require('dotenv').config()
const { 
    DEBUG,
    PORT,
    API_SECRET,
    MONGO_HOST,
    MONGO_DB,
    MONGO_PORT,
    MONGO_USER,
    MONGO_PASS,
    JAMENDO_CLIENT_ID,
    JAMENDO_CLIENT_SECRET,
    JAMENDO_REDIRECT_URI
} = require('./constants')

if (DEBUG)
{
    debug('> Started:\t\t', new Date().toLocaleString())
    debug('DEBUG\t\t\t', DEBUG)
    debug('PORT\t\t\t', PORT)
    debug('JAMENDO_CLIENT_ID\t\t', JAMENDO_CLIENT_ID)
    debug('JAMENDO_CLIENT_SECRET\t', JAMENDO_CLIENT_SECRET)
    debug('MONGO_USER\t\t', MONGO_USER)
    debug('MONGO_PASS\t\t', MONGO_PASS)
    debug('MONGO_HOST\t\t', MONGO_HOST)
    debug('MONGO_PORT\t\t', MONGO_PORT)
    debug('MONGO_DB\t\t\t', MONGO_DB)
}

if (!PORT || !API_SECRET)
    return debug('> Set the API environment variables first.')

if (!MONGO_HOST || !MONGO_PORT || !MONGO_DB || !MONGO_USER || ! MONGO_PASS)
    return debug('> Set the MONGO environment variables first.')

if (!JAMENDO_CLIENT_ID || !JAMENDO_CLIENT_SECRET)
    return debug('> Set the JAMENDO environment variables first.')
    
// MONGO ---------------------------------------------
require('./mongoose')(`mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`)

// WEB & API SERVER ----------------------------------
const app = express()

// configure app to use bodyParser() middleware
// this will let us get the data from a POST
//app.use(bodyParser.urlencoded({ extended: true }))  // para parsear formularios x-www-form-urlencoded
app.use(bodyParser.json())                          // para parsear formularios en formato raw/json

// CORS ----------------------------------------------
app.use(require('./cors'))

// PASSPORT ------------------------------------------
app.use(require('./passport')(API_SECRET))

// PUG -----------------------------------------------
app.set('view engine', 'pug')

// REGISTER OUR ROUTES -------------------------------
// routes for the open web
app.use('/', require('./routes/web'))
// routes for the register, login
app.use('/auth', require('./routes/auth'))
// all of our API routes will be prefixed with /api/v1
app.use('/api/v1', require('./routes/api'))
// jamendo auth
app.use('/jamendo', require('./routes/jamendo'))

// GLOBAL VARIABLES ----------------------------------
app.locals.token = ''

// SERVER UP -----------------------------------------
app.listen(PORT, () => {
    debug(`> Magic happens on port ${PORT}`) // eslint-disable-line
})

process.on('SIGINT', function() {
  debug('> Bye bye! Have a nice day ;-)')
  debug('> Closed:\t\t', new Date().toLocaleString())
  process.exit()
})