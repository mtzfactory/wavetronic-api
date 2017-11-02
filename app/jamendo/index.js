const Jamendo = require('jamendo')
const { JAMENDO_CLIENT_ID, JAMENDO_CLIENT_SECRET, JAMENDO_REDIRECT_URI } = require('../constants')

// Initialize the Jamendo Library
const jamendo = new Jamendo({
    client_id : JAMENDO_CLIENT_ID,
    protocol  : 'http',             // HTTP protocol to use, http or https 
    version   : 'v3.0',             // Use the specified API version 
   
    debug     : false,              // Print the whole response object and body in the console 
   
    rejectUnauthorized: false       // Ignore SSL certificates issues 
                                    // see TLS options http://nodejs.org/docs/v0.7.8/api/https.html 
})

// Set the configuration settings for Jamendo oauth
const credentials = {
    client: {
        id: JAMENDO_CLIENT_ID,
        secret: JAMENDO_CLIENT_SECRET
    },
    auth: {
        tokenHost: 'https://api.jamendo.com',
        tokenPath: '/v3.0/oauth/grant',
        authorizePath: '/v3.0/oauth/authorize',
    }
};

// Initialize the OAuth2 Library
const jamendoOauth2 = require('simple-oauth2').create(credentials)

// Authorization oauth2 URI
const jamendoAuthorizationUri = jamendoOauth2.authorizationCode.authorizeURL({
    redirect_uri: JAMENDO_REDIRECT_URI,
    state: 'mtzfactory'
})

module.exports = { jamendo, jamendoOauth2, jamendoAuthorizationUri }