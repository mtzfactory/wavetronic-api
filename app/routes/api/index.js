const express = require('express')

const router = express.Router()

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log(`${Date.now()} Something is happening with the API.`)
    next() // make sure we go to the next routes and don't stop here
});

router.use('/albums', require('./router-albums'))
router.use('/tracks', require('./router-tracks'))
router.use('/playlists', require('./router-playlists'))

module.exports = router