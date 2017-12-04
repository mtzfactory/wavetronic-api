const express = require('express')
const jsonTransform = require('express-json-transform')
const User = require('../../business/User')

const user = express.Router()

user.use((req, res, proceed) => {
    const { offset, limit, show } = req.query

    req.offset = offset ? parseInt(offset) : 0
    req.limit = limit ? parseInt(limit) : 15
    req.show = show
    req.hide = '_id'

    proceed()
})

user.route('/')
    .get(function(req, res) {
        const reqStart = new Date().getTime()
        const { id: userId, username } = req.user // Passport
        const { offset, limit, show, hide } = req // middleware del router api (index.js)
        const options = { offset, limit, show, hide }

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
    .put(function(req, res) {
        const reqStart = new Date().getTime()
        const { id: userId, username } = req.user // Passport
        const { pnToken } = req.body

        if (!pnToken)
            res.status(404).json({ status: 'error' , message: 'No PN token submitted.' })
        else {
            User.updatePushNotificationToken(userId, pnToken)
                .then( results => {
                    res.status(200).json({
                        status: 'success',
                        headers: { response_time: new Date().getTime() - reqStart },
                        results
                    })
                })
                .catch( error => res.status(404).json({ status: 'error' , message: error.message }) )
        }
    })

user.route('/logout')
    .get(function(req, res){
        const { id: userId, username } = req.user // Passport
        
        req.logout()

        res.status(200).json({
            status: 'success',
            message: `user ${username} logged out successfully`,
        })
        //res.redirect('/')
})

user.route('/friends')
    .get(function(req, res) {
        const reqStart = new Date().getTime()
        const { name: search, only_confirmed, only_friends } = req.query
        const { id: userId, username } = req.user // Passport
        const { offset, limit, show, hide } = req // middleware del router api (index.js)
        const options = { offset, limit, show, hide }

        if (search) {
            User.searchByUsername(userId, username, { search, only_confirmed, only_friends }, options)            
                .then( results => {
                    res.status(200).json({
                        status: 'success',
                        headers: {
                            offset,
                            limit,
                            results_count: results.results_count,
                            results_fullcount: results.results_fullcount,
                            response_time: new Date().getTime() - reqStart
                        },
                        results: results.results
                    })
                })
                .catch( error => res.status(404).json({ status: 'error' , message: error.message }) )
        }
        else {
            User.getFriends(userId, { only_confirmed }, options)
                .then( results => {
                    res.status(200).json({
                        status: 'success',
                        headers: {
                            offset,
                            limit,
                            results_count: results.results_count,
                            results_fullcount: results.results_fullcount,
                            response_time: new Date().getTime() - reqStart
                        },
                        results: results.results
                    })
                })
                .catch( error => res.status(404).json({ status: 'error' , message: error.message }) )
        }
    })
    .post(function(req, res) {
        const reqStart = new Date().getTime()
        const { id: userId, username } = req.user // Passport
        const { offset, limit, show, hide } = req // middleware del router api (index.js)
        const { name } = req.body

        User.addFriend(username, userId, name)
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
        const { offset, limit, show, hide } = req // middleware del router api (index.js)
        const { friendId } = req.params

        User.updateFriendship(userId, username, friendId)
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
        const { offset, limit, show, hide } = req // middleware del router api (index.js)
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
        const { offset, limit, show, hide } = req // middleware del router api (index.js)
        const { friendId, trackId } = req.params

        User.sendTrackToFriend(username, userId, friendId, trackId)
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
        const { offset, limit, show, hide } = req // middleware del router api (index.js)
        const options = { offset, limit, show, hide }

        User.getPlaylists(userId, options)
            .then( results => {
                res.status(200).json({
                    status: 'success',
                    headers: {
                        offset,
                        limit,
                        results_count: results.results_count,
                        results_fullcount: results.results_fullcount,
                        response_time: new Date().getTime() - reqStart
                    },
                    results: results
                })
            })
            .catch( error => res.status(404).json({ status: 'error' , message: error.message }) )
    })
    .post(function(req, res) {
        const reqStart = new Date().getTime()
        const { id: userId, username } = req.user // Passport
        const { offset, limit, show, hide } = req // middleware del router api (index.js)
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
        const { offset, limit, show, hide } = req // middleware del router api (index.js)
        const options = { offset, limit, show, hide }
        const { playlistId } = req.params

        User.getTracksFromPlaylist(userId, playlistId, options)
            .then( docs => {
                res.status(200).json({
                    status: 'success',
                    headers: {
                        results_count: docs.headers.results_count,
                        results_fullcount: docs.headers.results_fullcount,
                        response_time: new Date().getTime() - reqStart
                    },
                    results: docs.results
                })
            })
            .catch( error => res.status(404).json({ status: 'error' , message: error.message }) )
    })
    .delete(function(req, res) {
        const reqStart = new Date().getTime()
        const { id: userId, username } = req.user // Passport
        const { offset, limit, show, hide } = req // middleware del router api (index.js)
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
        const { offset, limit, show, hide } = req // middleware del router api (index.js)
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
        const { offset, limit, show, hide } = req // middleware del router api (index.js)
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
