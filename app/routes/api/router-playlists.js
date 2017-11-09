const express = require('express')
const jsonTransform = require('express-json-transform')
const musicService = require('../../services/MusicService')

const playlists = express.Router()

const removeThisProperties = [ 'zip', 'shorturl', 'shareurl' ]

const cleanJson = jsonTransform(function(json) {
    json.results.forEach(function(child) {
        removeThisProperties.forEach(function(item) {
            delete child[item]
        })
    })

    return json
})

playlists.route('/')
    .get(cleanJson, function(req, res) {
        const { offset, limit } = req
        const reqStart = new Date().getTime()

        const options = {
            offset,
            limit,
            order: 'creationdate_desc'
        }

        musicService.getPlaylists(options)
            .then( data => {
                data.headers.response_time = new Date().getTime() - reqStart
                data.headers.offset = offset
                data.headers.limit = limit
                res.status(200).json(data) 
            })
            .catch( error => res.status(404).json(error.message) )
    })

playlists.route('/search/:namesearch')
    .get(cleanJson, function(req, res) {
        const { offset, limit } = req
        const reqStart = new Date().getTime()

        const options = {
            offset,
            limit,
            namesearch: req.params.namesearch,
            order: 'creationdate_desc'
        }

        musicService.getPlaylists(options)
            .then( data => {
                data.headers.response_time = new Date().getTime() - reqStart
                data.headers.offset = offset
                data.headers.limit = limit
                res.status(200).json(data) 
            })
            .catch( error => res.status(404).json(error.message) )
    })

playlists.route('/id/:playlist_id')
    .get(cleanJson, function(req, res) {
        const reqStart = new Date().getTime()
        
        const options = {
            id: req.params.playlist_id,
        }

        musicService.getPlaylistTracks(options)
            .then( data => {
                data.headers.response_time = new Date().getTime() - reqStart
                res.status(200).json(data) 
            })
            .catch( error => res.status(404).json(error.message) )
    })

module.exports = playlists