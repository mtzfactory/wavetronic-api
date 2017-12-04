const express = require('express')
const passport = require('passport')

const { DEBUG } = require('../../constants')

const api = express.Router()

api.use(passport.authenticate('jwt', { session: false }))

if (DEBUG) {
    // middleware to use for all requests
    api.use(function(req, res, next) {
        // do logging
        const { method, path, body} = req
        //debug({ method, path, body })
        next() // make sure we go to the next routes and don't stop here
    })
}

api.get('/', (req, res) => {
    const { id: userId, username } = req.user // Passport

    res.status(200)
        .json({
            'status': 'success',
            'message': `${username}, welcome to WAVETRONIC Api !`
        })
})

api.use('/albums', require('./router-album'))
api.use('/tracks', require('./router-track'))
api.use('/playlists', require('./router-playlist'))
api.use('/user', require('./router-user'))

module.exports = api