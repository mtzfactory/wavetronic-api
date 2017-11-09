const express = require('express')
const jsonTransform = require('express-json-transform')
const musicService = require('../../services/MusicService')

const albums = express.Router()

const removeThisProperties = [ 'zip', 'shorturl', 'shareurl' ]

const cleanJson = jsonTransform(function(json) {
    json.results.forEach(function(child) {
        removeThisProperties.forEach(function(item) {
            delete child[item]
        })
    })
    
    return json
})

albums.route('/')
    .get(cleanJson, function(req, res) {
        const reqStart = new Date().getTime()
        
        const options = {
            offset: req.query.offset || 0,
            limit: req.query.limit || 15,
            order: 'popularity_month',
        }

        musicService.getAlbums(options)
            .then( data => {
                data.headers.response_time = new Date().getTime() - reqStart
                res.status(200).json(data) 
            })
            .catch( error => res.status(404).json(error.message) )
    })

albums.route('/id/:album_id')
    .get(cleanJson, function(req, res) {
        const reqStart = new Date().getTime()

        const options = {
            order: 'popularity_month',
            id: req.params.album_id.split(',')
        }

        musicService.getAlbums(options)
            .then( data => {
                data.headers.response_time = new Date().getTime() - reqStart
                res.status(200).json(data) 
            })
            .catch( error => res.status(404).json(error.message) )
    })

module.exports = albums