const express = require('express')
const bodyParser = require('body-parser')
const moment = require('moment')
const debug = require('debug')('app')

require('dotenv').config()
const { DEBUG, PORT, JAMENDO_CLIENT_ID, JAMENDO_CLIENT_SECRET, JAMENDO_REDIRECT_URI } = require('./constants')

if (DEBUG)
{
    debug('DEBUG\t\t\t', DEBUG)
    debug('SERVER PORT\t\t', PORT)
    debug('JAMENDO_CLIENT_ID\t\t', JAMENDO_CLIENT_ID)
    debug('JAMENDO_CLIENT_SECRET\t', JAMENDO_CLIENT_SECRET)
}
if (!PORT || !JAMENDO_CLIENT_ID || !JAMENDO_CLIENT_SECRET)
    return debug('Set the environment first.')

const app = express()

// CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    
    next()
})

// configure app to use bodyParser() middleware
// this will let us get the data from a POST
//app.use(bodyParser.urlencoded({ extended: true }))  // para parsear formularios x-www-form-urlencoded
app.use(bodyParser.json())                          // para parsear formularios en formato raw/json

// REGISTER OUR ROUTES -------------------------------
// all of our API routes will be prefixed with /api/v1
app.use('/api/v1', require('./routes/api'))
// rest of the web
app.use('/', require('./routes/web'))

// PUG
app.set('view engine', 'pug')

// GLOBAL VARIABLES
app.locals.token = ''

app.listen(PORT, () => {
    debug(`Magic happens on port ${PORT}`) // eslint-disable-line
})

process.on('SIGINT', function() {
  debug('Bye bye! Have a nice day ;-)')
  process.exit()
})