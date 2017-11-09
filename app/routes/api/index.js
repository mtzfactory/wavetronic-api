const express = require('express')
const debug = require('debug')('api')

const { DEBUG } = require('../../constants')

const api = express.Router()

if (DEBUG) {
    // middleware to use for all requests
    router.use(function(req, res, next) {
        // do logging
        const { method, path, body} = req
        debug({ method, path, body })
        //console.log(`${Date.now()} Something is happening with the API.`)
        next() // make sure we go to the next routes and don't stop here
    })
}

api.use('/albums', require('./router-albums'))
api.use('/tracks', require('./router-tracks'))
api.use('/playlists', require('./router-playlists'))

module.exports = api