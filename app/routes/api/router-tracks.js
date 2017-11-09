const express = require('express')
const jsonTransform = require('express-json-transform')
const musicService = require('../../services/MusicService')

const tracks = express.Router()

const removeThisProperties = [ 'license_ccurl', 'audiodownload', 'position', 'prourl', 'shorturl', 'shareurl' ]

const cleanJson = jsonTransform(function(json) {
    json.results.forEach(function(child) {
        removeThisProperties.forEach(function(item) {
            delete child[item]
        })
    })

    return json
})

tracks.route('/')
    .get(cleanJson, function(req, res) {
        const { offset, limit } = req
        const reqStart = new Date().getTime()

        const options = {
            offset,
            limit,
            order: 'popularity_month',
            featured: true
        }

        musicService.getTracks(options)
            .then( data => {
                data.headers.response_time = new Date().getTime() - reqStart
                data.headers.offset = offset
                data.headers.limit = limit
                res.status(200).json(data) 
            })
            .catch( error => res.status(404).json(error.message) )
    })

tracks.route('/tags/:fuzzytags')
    .get(cleanJson, function(req, res) {
        const { offset, limit } = req
        const reqStart = new Date().getTime()

        const options = {
            offset,
            limit,
            order: 'popularity_month',
            featured: true,
            fuzzytags: req.params.fuzzytags
        }

        musicService.getTracks(options)
            .then( data => {
                data.headers.response_time = new Date().getTime() - reqStart
                data.headers.offset = offset
                data.headers.limit = limit
                res.status(200).json(data) 
            })
            .catch( error => res.status(404).json(error.message) )
    })

module.exports = tracks