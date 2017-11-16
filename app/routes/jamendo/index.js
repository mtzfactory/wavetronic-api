const express = require('express')
const debug = require('debug')('jmo')

const { DEBUG, JAMENDO_REDIRECT_URI } = require('../../constants')
const { jamendoOauth2, jamendoAuthorizationUri } = require('../../jamendo')

var jamendo = express.Router()

if (DEBUG) {
    // middleware to use for all requests
    jamendo.use(function(req, res, next) {
        // do logging
        const { method, path, body} = req
        debug({ method, path, body })
        //console.log(`${Date.now()} Something is happening with the API.`)
        next() // make sure we go to the next routes and don't stop here
    })
}

// Initial page redirecting to Jamendo oath service
jamendo.route('/auth')
    .get((req, res) => {
        res.redirect(jamendoAuthorizationUri)
    })

// Callback service parsing the authorization token and asking for the access token
jamendo.route('/oauth2/callback')
    .get((req, res) => {
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
                        'status': 'error',
                        'message': error.message
                    })
            })
    })

module.exports = jamendo
