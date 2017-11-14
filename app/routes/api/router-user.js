const express = require('express')
const jsonTransform = require('express-json-transform')
const User = require('../../business/User')

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

        User.getUserProfile(userId)
            .then( results => {
                res.status(200).json({
                    status: 'success',
                    headers: { response_time: new Date().getTime() - reqStart },
                    results
                }) 
            })
            .catch( error => res.status(404).json({ status: 'error' , message: error.message }) )
    })

user.route('/friends')
    .get(function(req, res) {
        const reqStart = new Date().getTime()
        const { id: userId, username } = req.user // Passport
        const { page, limit, show, hide } = req // middleware del router api (index.js)
        const options = { page, limit, show, hide }
        
        User.getFriends(userId, options)
            .then( results => {
                res.status(200).json({
                    status: 'success',
                    headers: { page, limit, response_time: new Date().getTime() - reqStart },
                    results
                }) 
            })
            .catch( error => res.status(404).json({ status: 'error' , message: error.message }) )
    })
    .post(function(req, res) {
        const reqStart = new Date().getTime()
        const { id: userId, username } = req.user // Passport
        const { page, limit, show, hide } = req // middleware del router api (index.js)
        const { name } = req.body

        User.addFriend(userId, name)
            .then( results => {
                res.status(200).json({
                    status: 'success',
                    headers: { response_time: new Date().getTime() - reqStart },
                    results
                }) 
            })
            .catch( error => res.status(404).json({ status: 'error' , message: error.message }) )
    })

user.route('/friends/:friendId')
    .put(function(req, res) {
        const reqStart = new Date().getTime()
        const { id: userId, username } = req.user // Passport
        const { page, limit, show, hide } = req // middleware del router api (index.js)
        const { friendId } = req.params
        
        User.updateFriendship(userId, friendId)
            .then( results => {
                res.status(200).json({
                    status: 'success',
                    headers: { response_time: new Date().getTime() - reqStart },
                    results
                }) 
            })
            .catch( error => res.status(404).json({ status: 'error' , message: error.message }) )
    })
    .delete(function(req, res) {
        const reqStart = new Date().getTime()
        const { id: userId, username } = req.user // Passport
        const { page, limit, show, hide } = req // middleware del router api (index.js)
        const { friendId } = req.params

        User.removeFriend(userId, friendId)
            .then( results => {
                res.status(200).json({
                    status: 'success',
                    headers: { response_time: new Date().getTime() - reqStart },
                    results
                }) 
            })
            .catch( error => res.status(404).json({ status: 'error' , message: error.message }) )
    })

user.route('/friends/:friendId/track/:trackId')
    .get(function(req, res) {
        const reqStart = new Date().getTime()
        const { id: userId, username } = req.user // Passport
        const { page, limit, show, hide } = req // middleware del router api (index.js)
        const { friendId, track } = req.params

        User.sendTrackToFriend(userId, friendId, track)
            .then( results => {
                res.status(200).json({
                    status: 'success',
                    headers: { response_time: new Date().getTime() - reqStart },
                    results
                }) 
            })
            .catch( error => res.status(404).json({ status: 'error' , message: error.message }) )
    })

user.route('/playlists')
    .get(function(req, res) {
        const reqStart = new Date().getTime()
        const { id: userId, username } = req.user // Passport
        const { page, limit, show, hide } = req // middleware del router api (index.js)
        const options = { page, limit, show, hide }
        
        User.getPlaylists(userId, options)
            .then( results => {
                res.status(200).json({
                    status: 'success',
                    headers: { page, limit, response_time: new Date().getTime() - reqStart },
                    results
                }) 
            })
            .catch( error => res.status(404).json({ status: 'error' , message: error.message }) )
    })
    .post(function(req, res) {
        const reqStart = new Date().getTime()
        const { id: userId, username } = req.user // Passport
        const { page, limit, show, hide } = req // middleware del router api (index.js)
        const { name, description } = req.body

        User.addPlaylist(userId, name, description)
            .then( results => {
                res.status(200).json({
                    status: 'success',
                    headers: { response_time: new Date().getTime() - reqStart },
                    results
                }) 
            })
            .catch( error => res.status(404).json({ status: 'error' , message: error.message }) )
    })


user.route('/playlists/:playlistId')
    .get(function(req, res) {
        const reqStart = new Date().getTime()
        const { id: userId, username } = req.user // Passport
        const { page, limit, show, hide } = req // middleware del router api (index.js)
        const { playlistId } = req.params

        User.getTracksFromPlaylist(userId, playlistId)
            .then( results => {
                res.status(200).json({
                    status: 'success',
                    headers: { response_time: new Date().getTime() - reqStart },
                    results
                }) 
            })
            .catch( error => res.status(404).json({ status: 'error' , message: error.message }) )
    })
    .delete(function(req, res) {
        const reqStart = new Date().getTime()
        const { id: userId, username } = req.user // Passport
        const { page, limit, show, hide } = req // middleware del router api (index.js)
        const { playlistId } = req.params

        User.removePlaylist(userId, playlistId)
            .then( results => {
                res.status(200).json({
                    status: 'success',
                    headers: { response_time: new Date().getTime() - reqStart },
                    results
                }) 
            })
            .catch( error => res.status(404).json({ status: 'error' , message: error.message }) )
    })

user.route('/playlists/:playlistId/track/:trackId')
    .put(function(req, res) {
        const reqStart = new Date().getTime()
        const { id: userId, username } = req.user // Passport
        const { page, limit, show, hide } = req // middleware del router api (index.js)
        const { playlistId, trackId } = req.params

        User.addTrackToPlaylist(userId, playlistId, trackId)
            .then( results => {
                res.status(200).json({
                    status: 'success',
                    headers: { response_time: new Date().getTime() - reqStart },
                    results
                }) 
            })
            .catch( error => res.status(404).json({ status: 'error' , message: error.message }) )
    })
    .delete(function(req, res) {
        const reqStart = new Date().getTime()
        const { id: userId, username } = req.user // Passport
        const { page, limit, show, hide } = req // middleware del router api (index.js)
        const { playlistId, trackId } = req.params

        User.removeTrackFromPlaylist(userId, playlistId, trackId)
            .then( results => {
                res.status(200).json({
                    status: 'success',
                    headers: { response_time: new Date().getTime() - reqStart },
                    results
                }) 
            })
            .catch( error => res.status(404).json({ status: 'error' , message: error.message }) )
    })

module.exports = user