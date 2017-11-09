const express = require('express')
const bodyParser = require('body-parser')
const moment = require('moment')
const debug = require('debug')('app')

require('dotenv').config()
const { 
    DEBUG,
    API_PORT,
    MONGO_URL,
    MONGO_DB,
    MONGO_PORT,
    PASSPORT_SECRET,
    JAMENDO_CLIENT_ID,
    JAMENDO_CLIENT_SECRET,
    JAMENDO_REDIRECT_URI
} = require('./constants')

if (DEBUG)
{
    debug('DEBUG\t\t\t\t', DEBUG)
    debug('API_PORT\t\t\t\t', API_PORT)
    debug('JAMENDO_CLIENT_ID\t\t\t', JAMENDO_CLIENT_ID)
    debug('JAMENDO_CLIENT_SECRET\t\t', JAMENDO_CLIENT_SECRET)
    debug('MONGO_URL:MONGO_PORT/MONGO_DB\t', `${MONGO_URL}:${MONGO_PORT}/${MONGO_DB}`)
}

if (!API_PORT || !MONGO_URL || !MONGO_PORT || !MONGO_DB || !PASSPORT_SECRET || !JAMENDO_CLIENT_ID || !JAMENDO_CLIENT_SECRET)
    return debug('> Set the environment variables first.')

// MONGO ---------------------------------------------
require('./mongoose')(`${MONGO_URL}:${MONGO_PORT}/${MONGO_DB}`)

// WEB & API SERVER ----------------------------------
const app = express()

// configure app to use bodyParser() middleware
// this will let us get the data from a POST
//app.use(bodyParser.urlencoded({ extended: true }))  // para parsear formularios x-www-form-urlencoded
app.use(bodyParser.json())                          // para parsear formularios en formato raw/json

// CORS ----------------------------------------------
app.use(require('./cors'))

// PASSPORT ------------------------------------------
app.use(require('./passport')(PASSPORT_SECRET))

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
app.listen(API_PORT, () => {
    debug(`> Magic happens on port ${API_PORT}`) // eslint-disable-line
})

process.on('SIGINT', function() {
  debug('> Bye bye! Have a nice day ;-)')
  process.exit()
})