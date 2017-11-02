const express = require('express')

const { JAMENDO_REDIRECT_URI } = require('../../constants')
const { jamendoOauth2, jamendoAuthorizationUri } = require('../../jamendo')

var router = express.Router()

router.get('/', (req, res) => {
    //res.end('<h1>Welcome!</h1><br><p>How is your day?</p>')
    const timestamp = new Date()
    res.render('index', { title: 'Home Page', message: `rendered on ${timestamp}` })
})

router.get('/demo', (req, res) => {
    const anchors = [
        {link: '/auth', text: 'Get jamendo token' },
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

// Initial page redirecting to Jamendo oath service
router.get('/auth', (req, res) => {
    res.redirect(jamendoAuthorizationUri)
})

// Callback service parsing the authorization token and asking for the access token
router.get('/oauth2/callback', (req, res) => {
    const code = req.query.code
    console.log('oath2 token:', code)
    
    if (!code)
    console.error('NO oath2 token')
        return res.redirect('/demo')

    const options = {
        code,
        redirect_uri: JAMENDO_REDIRECT_URI
    }
    
    jamendoOauth2.authorizationCode.getToken(options)
        .then(result => {
            req.app.locals.token = jamendoOauth2.accessToken.create(result)
    
            res.redirect('/demo')
                // .status(200)
                // .json(token)
        })
        .catch(error => {
            res.status(404)
                .json({
                    'error': 'Authentication failed',
                    'message': error
                })
        })
})

module.exports = router