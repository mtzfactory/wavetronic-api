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
        const reqStart = new Date().getTime()

        const options = {
            //access_token: req.app.locals.token,
            //namesearch: 
            //datebetween: 
            offset: req.query.offset || 0,
            limit: req.query.limit || 15,
            order: 'creationdate_desc'
        }

        musicService.getPlaylists(options)
            .then( data => {
                data.headers.response_time = new Date().getTime() - reqStart
                res.status(200).json(data) 
            })
            .catch( error => res.status(404).json(error.message) )
    })

playlists.route('/search/:namesearch')
    .get(cleanJson, function(req, res) {
        const reqStart = new Date().getTime()

        const options = {
            offset: req.query.offset || 0,
            limit: req.query.limit || 15,
            //access_token: req.app.locals.token,
            namesearch: req.params.namesearch,
            //datebetween: 
            order: 'creationdate_desc'
        }

        musicService.getPlaylists(options)
            .then( data => {
                data.headers.response_time = new Date().getTime() - reqStart
                res.status(200).json(data) 
            })
            .catch( error => res.status(404).json(error.message) )
    })

playlists.route('/tracks/:playlist_id')
    .get(cleanJson, function(req, res) {
        const reqStart = new Date().getTime()
        
        const options = {
            //access_token: req.app.locals.token,
            id: req.params.playlist_id,
            //datebetween: 
            //order: 'creationdate_desc'
        }

        musicService.getPlaylistTracks(options)
            .then( data => {
                data.headers.response_time = new Date().getTime() - reqStart
                res.status(200).json(data) 
            })
            .catch( error => res.status(404).json(error.message) )
    })

module.exports = playlists