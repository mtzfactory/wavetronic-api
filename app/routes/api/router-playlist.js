const express = require('express')
const jsonTransform = require('express-json-transform')
const musicBusiness = require('../../business/Music')

const playlist = express.Router()

const removeThisProperties = [ 'zip', 'shorturl', 'shareurl' ]

const cleanJson = jsonTransform(function(json) {
    json.results.forEach(function(child) {
        removeThisProperties.forEach(function(item) {
            delete child[item]
        })
    })

    return json
})

playlist.use((req, res, proceed) => {
    const { offset, limit, show } = req.query

    req.offset = offset ? parseInt(offset) : 0
    req.limit = limit ? parseInt(limit) : 15
    req.show = show

    proceed()
})

playlist.route('/')
    .get(cleanJson, function(req, res) {
        const { offset, limit } = req
        const reqStart = new Date().getTime()

        const options = {
            offset,
            limit,
            order: 'creationdate_desc'
        }

        musicBusiness.getPlaylists(options)
            .then( data => {
                data.headers.response_time = new Date().getTime() - reqStart
                data.headers.offset = offset
                data.headers.limit = limit
                res.status(200).json(data)
            })
            .catch( error => res.status(404).json({ status: 'error' , message: error.message }) )
    })

playlist.route('/search/:namesearch')
    .get(cleanJson, function(req, res) {
        const { offset, limit } = req
        const reqStart = new Date().getTime()

        const options = {
            offset,
            limit,
            namesearch: req.params.namesearch,
            order: 'creationdate_desc'
        }

        musicBusiness.getPlaylists(options)
            .then( data => {
                data.headers.response_time = new Date().getTime() - reqStart
                data.headers.offset = offset
                data.headers.limit = limit
                res.status(200).json(data)
            })
            .catch( error => res.status(404).json({ status: 'error' , message: error.message }) )
    })

playlist.route('/id/:playlist_id')
    .get(cleanJson, function(req, res) {
        const reqStart = new Date().getTime()

        const options = {
            id: req.params.playlist_id,
        }

        musicBusiness.getPlaylistTracks(options)
            .then( data => {
                data.headers.response_time = new Date().getTime() - reqStart
                res.status(200).json(data)
            })
            .catch( error => res.status(404).json({ status: 'error' , message: error.message }) )
    })

module.exports = playlist
