const express = require('express')
const jsonTransform = require('express-json-transform')
const userBusiness = require('../../business/User')

const user = express.Router()

user.use((req, res, proceed) => {
    const { page, limit, show } = req.query

    req.page = page ? parseInt(page) : 1
    req.limit = limit ? parseInt(limit) : 15
    req.show = show
    req.hide = '_id'

    proceed()
})

user.route('/')
    .get(function(req, res) {
        const reqStart = new Date().getTime()
        const { id: userId, username } = req.user // Passport
        const { page, limit, show, hide } = req // middleware del router api (index.js)
        const options = { page, limit, show, hide }

        userBusiness.getUserProfile(userId)
            .then( data => {
                res.status(200).json({
                    status: 'success',
                    headers: { response_time: new Date().getTime() - reqStart },
                    data
                }) 
            })
            .catch( error => res.status(404).json(error.message) )
    })

user.route('/friends')
    .get(function(req, res) {
        const reqStart = new Date().getTime()
        const { id: userId, username } = req.user // Passport
        const { page, limit, show, hide } = req // middleware del router api (index.js)
        const options = { page, limit, show, hide }
        
        userBusiness.getFriends(userId, options)
            .then( data => {
                res.status(200).json({
                    status: 'success',
                    headers: { page, limit, response_time: new Date().getTime() - reqStart },
                    data
                }) 
            })
            .catch( error => res.status(404).json(error.message) )
    })
    .post(function(req, res) {
        const reqStart = new Date().getTime()
        const { id: userId, username } = req.user // Passport
        const { page, limit, show, hide } = req // middleware del router api (index.js)
        const { name } = req.body

        userBusiness.addFriend(userId, name)
            .then( data => {
                res.status(200).json({
                    status: 'success',
                    headers: { response_time: new Date().getTime() - reqStart },
                    data
                }) 
            })
            .catch( error => res.status(404).json(error.message) )
    })

user.route('/friends/:friendId')
    .put(function(req, res) {
        const reqStart = new Date().getTime()
        const { id: userId, username } = req.user // Passport
        const { page, limit, show, hide } = req // middleware del router api (index.js)
        const { friendId } = req.params
        
        userBusiness.updateFriendship(userId, friendId)
            .then( data => {
                res.status(200).json({
                    status: 'success',
                    headers: { response_time: new Date().getTime() - reqStart },
                    data
                }) 
            })
            .catch( error => res.status(404).json(error.message) )
    })
    .delete(function(req, res) {
        const reqStart = new Date().getTime()
        const { id: userId, username } = req.user // Passport
        const { page, limit, show, hide } = req // middleware del router api (index.js)
        const { friendId } = req.params

        userBusiness.removeFriend(userId, friendId)
            .then( data => {
                res.status(200).json({
                    status: 'success',
                    headers: { response_time: new Date().getTime() - reqStart },
                    data
                }) 
            })
            .catch( error => res.status(404).json(error.message) )
    })

user.route('/friends/:friendId/track/:trackId')
    .get(function(req, res) {
        const reqStart = new Date().getTime()
        const { id: userId, username } = req.user // Passport
        const { page, limit, show, hide } = req // middleware del router api (index.js)
        const { friendId, track } = req.params

        userBusiness.sendTrackToFriend(userId, friendId, track)
            .then( data => {
                res.status(200).json({
                    status: 'success',
                    headers: { response_time: new Date().getTime() - reqStart },
                    data
                }) 
            })
            .catch( error => res.status(404).json(error.message) )
    })

user.route('/playlists')
    .get(function(req, res) {
        const reqStart = new Date().getTime()
        const { id: userId, username } = req.user // Passport
        const { page, limit, show, hide } = req // middleware del router api (index.js)
        const options = { page, limit, show, hide }
        
        userBusiness.getPlaylists(userId, options)
            .then( data => {
                res.status(200).json({
                    status: 'success',
                    headers: { page, limit, response_time: new Date().getTime() - reqStart },
                    data
                }) 
            })
            .catch( error => res.status(404).json(error.message) )
    })
    .post(function(req, res) {
        const reqStart = new Date().getTime()
        const { id: userId, username } = req.user // Passport
        const { page, limit, show, hide } = req // middleware del router api (index.js)
        const { name, description } = req.body

        userBusiness.addPlaylist(userId, name, description)
            .then( data => {
                res.status(200).json({
                    status: 'success',
                    headers: { response_time: new Date().getTime() - reqStart },
                    data
                }) 
            })
            .catch( error => res.status(404).json(error.message) )
    })


user.route('/playlists/:playlistId')
    .get(function(req, res) {
        const reqStart = new Date().getTime()
        const { id: userId, username } = req.user // Passport
        const { page, limit, show, hide } = req // middleware del router api (index.js)
        const { playlistId } = req.params

        userBusiness.getTracksFromPlaylist(userId, playlistId)
            .then( data => {
                res.status(200).json({
                    status: 'success',
                    headers: { response_time: new Date().getTime() - reqStart },
                    data
                }) 
            })
            .catch( error => res.status(404).json(error.message) )
    })
    .delete(function(req, res) {
        const reqStart = new Date().getTime()
        const { id: userId, username } = req.user // Passport
        const { page, limit, show, hide } = req // middleware del router api (index.js)
        const { playlistId } = req.params

        userBusiness.removePlaylist(userId, playlistId)
            .then( data => {
                res.status(200).json({
                    status: 'success',
                    headers: { response_time: new Date().getTime() - reqStart },
                    data
                }) 
            })
            .catch( error => res.status(404).json(error.message) )
    })

user.route('/playlists/:playlistId/track/:trackId')
    .put(function(req, res) {
        const reqStart = new Date().getTime()
        const { id: userId, username } = req.user // Passport
        const { page, limit, show, hide } = req // middleware del router api (index.js)
        const { playlistId, trackId } = req.params

        userBusiness.addTrackToPlaylist(userId, playlistId, trackId)
            .then( data => {
                res.status(200).json({
                    status: 'success',
                    headers: { response_time: new Date().getTime() - reqStart },
                    data
                }) 
            })
            .catch( error => res.status(404).json(error.message) )
    })
    .delete(function(req, res) {
        const reqStart = new Date().getTime()
        const { id: userId, username } = req.user // Passport
        const { page, limit, show, hide } = req // middleware del router api (index.js)
        const { playlistId, trackId } = req.params

        userBusiness.removeTrackFromPlaylist(userId, playlistId, trackId)
            .then( data => {
                res.status(200).json({
                    status: 'success',
                    headers: { response_time: new Date().getTime() - reqStart },
                    data
                }) 
            })
            .catch( error => res.status(404).json(error.message) )
    })

module.exports = user