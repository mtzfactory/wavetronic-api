const express = require('express')
const debug = require('debug')('web')

const { DEBUG, JAMENDO_REDIRECT_URI } = require('../../constants')
const { jamendoOauth2, jamendoAuthorizationUri } = require('../../jamendo')

var web = express.Router()

if (DEBUG) {
    // middleware to use for all requests
    web.use(function(req, res, next) {
        // do logging
        const { method, path, body} = req
        console.log(path)
        if (!path.match(/(api)|(auth)|(jamendo)/)) debug({ method, path, body })
        //console.log(`${Date.now()} Something is happening with the API.`)
        next() // make sure we go to the next routes and don't stop here
    })
}

web.get('/', (req, res) => {
    //res.end('<h1>Welcome!</h1><br><p>How is your day?</p>')
    const timestamp = new Date()
    res.render('index', { title: 'Home Page', message: `rendered on ${timestamp}` })
})

web.get('/demo', (req, res) => {
    const anchors = [
        {link: '/jamendo/auth', text: 'Get jamendo token' },
        {link: '/api/v1/tracks', text: 'Get jamendo tracks' },
        {link: '/api/v1/albums', text: 'Get jamendo albums' },
        {link: '/api/v1/playlists', text: 'Get jamendo playlists' }
    ]

    res.render('demo', { title: 'Demo', anchors: anchors })
    // res.end(`<h1>Demo</h1>
    // <br><a href="/auth">Get <strong>jamendo</strong> token</a>
    // <br><a href="/api/v1/tracks">Get <strong>jamendo</strong> tracks</a>
    // <br><a href="/api/v1/albums">Get <strong>jamendo</strong> albums</a>
    // <br><a href="/api/v1/playlists">Get <strong>jamendo</strong> playlists</a>`)
})

module.exports = web