const express = require('express')
const jsonTransform = require('express-json-transform')
const musicBusiness = require('../../business/Music')

const track = express.Router()

const removeThisProperties = [ 'license_ccurl', 'audiodownload', 'position', 'prourl', 'shorturl', 'shareurl' ]

const cleanJson = jsonTransform(function(json) {
    json.results.forEach(function(child) {
        removeThisProperties.forEach(function(item) {
            delete child[item]
        })
    })

    return json
})

track.use((req, res, proceed) => {
    const { offset, limit, show } = req.query

    req.offset = offset ? parseInt(offset) : 1
    req.limit = limit ? parseInt(limit) : 15
    req.show = show

    proceed()
})

track.route('/')
    .get(cleanJson, function(req, res) {
        const { offset, limit } = req
        const reqStart = new Date().getTime()

        const options = {
            offset,
            limit,
            order: 'popularity_month',
            featured: true
        }

        musicBusiness.getTracks(options)
            .then( data => {
                data.headers.response_time = new Date().getTime() - reqStart
                data.headers.offset = offset
                data.headers.limit = limit
                res.status(200).json(data)
            })
            .catch( error => res.status(404).json({ status: 'error' , message: error.message }) )
    })

track.route('/tags/:fuzzytags')
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

        musicBusiness.getTracks(options)
            .then( data => {
                data.headers.response_time = new Date().getTime() - reqStart
                data.headers.offset = offset
                data.headers.limit = limit
                res.status(200).json(data)
            })
            .catch( error => res.status(404).json({ status: 'error' , message: error.message }) )
    })

module.exports = track
