const express = require('express')
const jsonTransform = require('express-json-transform')
const musicBusiness = require('../../business/Music')

const album = express.Router()

const removeThisProperties = [ 'zip', 'shorturl', 'shareurl' ]

const cleanJson = jsonTransform(function(json) {
    if (json && json.results)
      json.results.forEach(function(child) {
          removeThisProperties.forEach(function(item) {
              delete child[item]
          })
      })

    return json
})

album.use((req, res, proceed) => {
    const { offset, limit, show } = req.query

    req.offset = offset ? parseInt(offset) : 0
    req.limit = limit ? parseInt(limit) : 15
    req.show = show

    proceed()
})

album.route('/')
    .get(cleanJson, function(req, res) {
        const { offset, limit } = req
        const reqStart = new Date().getTime()

        const options = {
            offset,
            limit,
            order: 'popularity_month',
        }

        musicBusiness.getAlbums(options)
            .then( data => {
                data.headers.response_time = new Date().getTime() - reqStart
                data.headers.offset = offset
                data.headers.limit = limit
                res.status(200).json(data)
            })
            .catch( error => res.status(404).json({ status: 'error' , message: error.message }) )
    })

album.route('/:albumId')
    .get(cleanJson, function(req, res) {
        const reqStart = new Date().getTime()
        const { albumId } = req.params

        console.log(albumId)

        const options = {
            id: albumId
        }

        musicBusiness.getTracksByAlbum(options)
            .then( data => {
                data.headers.response_time = new Date().getTime() - reqStart
                res.status(200).json(data)
            })
            .catch( error => res.status(404).json({ status: 'error' , message: error.message }) )
    })

module.exports = album
