const express = require('express')
const passport = require('passport')
const debug = require('debug')('api')

const { DEBUG } = require('../../constants')

const api = express.Router()

api.use(passport.authenticate('jwt', { session: false }))

if (DEBUG) {
    // middleware to use for all requests
    api.use(function(req, res, next) {
        // do logging
        const { method, path, body} = req
        debug({ method, path, body })
        //console.log(`${Date.now()} Something is happening with the API.`)
        next() // make sure we go to the next routes and don't stop here
    })
}

api.use((req, res, proceed) => {
    const { offset, limit } = req.query

    req.offset = offset ? parseInt(offset) : 1
    req.limit = limit ? parseInt(limit) : 15

    proceed()
})

api.get('/', (req, res) => {
    res.status(200)
        .json({
            'status': 'success',
            'message': 'Welcome to Music Share API !'
        })
})

api.use('/albums', require('./router-albums'))
api.use('/tracks', require('./router-tracks'))
api.use('/playlists', require('./router-playlists'))

module.exports = api