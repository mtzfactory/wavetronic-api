const express = require('express')
const jsonTransform = require('express-json-transform')
const musicService = require('../../services/MusicService')

const router = express.Router()

const removeThisProperties = [ 'license_ccurl', 'audiodownload', 'position', 'prourl', 'shorturl', 'shareurl' ]

const cleanJson = jsonTransform(function(json) {
    json.results.forEach(function(child) {
        removeThisProperties.forEach(function(item) {
            delete child[item]
        })
    })

    return json
})

router.route('/')
    .get(cleanJson, function(req, res) {
        const reqStart = new Date().getTime()

        const options = {
            offset: req.query.offset || 0,
            limit: req.query.limit || 15,
            order: 'popularity_month',
            featured: true
        }

        musicService.getTracks(options)
            .then( data => {
                data.headers.response_time = new Date().getTime() - reqStart
                res.status(200).json(data) 
            })
            .catch( error => res.status(404).json(error.message) )
    })

router.route('/tags/:fuzzytags')
    .get(cleanJson, function(req, res) {
        const reqStart = new Date().getTime()

        const options = {
            offset: req.query.offset || 0,
            limit: req.query.limit || 15,
            order: 'popularity_month',
            featured: true,
            fuzzytags: req.params.fuzzytags
        }

        musicService.getTracks(options)
            .then( data => {
                data.headers.response_time = new Date().getTime() - reqStart
                res.status(200).json(data) 
            })
            .catch( error => res.status(404).json(error.message) )
    })

module.exports = router