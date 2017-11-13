const express = require('express')
const jsonTransform = require('express-json-transform')
const userService = require('../../services/UserService')

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

        userService.getUserProfile(userId)
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
        
        userService.getFriends(userId, options)
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

        userService.addFriend(userId, name)
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
        
        userService.updateFriendship(userId, friendId)
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

        userService.removeFriend(userId, friendId)
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

        userService.sendTrackToFriend(userId, friendId, track)
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
        
        userService.getPlaylists(userId, options)
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

        userService.addPlaylist(userId, name)
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

        userService.getTracksFromPlaylist(userId, playlistId)
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

        userService.removePlaylist(userId, playlistId)
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

        userService.addTrackToPlaylist(userId, playlistId, trackId)
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

        userService.removeTrackFromPlaylist(userId, playlistId, trackId)
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