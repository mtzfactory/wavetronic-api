const express = require('express')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const debug = require('debug')('auth')
const User = require('../../data/models/UserModel')

const { DEBUG, API_SECRET } = require('../../constants')

const auth = express.Router()

if (DEBUG) {
    // middleware to use for all requests
    auth.use(function(req, res, next) {
        // do logging
        const { method, path, body} = req
        debug({ method, path, body })
        //console.log(`${Date.now()} Something is happening with the API.`)
        next() // make sure we go to the next routes and don't stop here
    })
}

auth.post('/register', (req, res) => {
    const { username, password, email } = req.body

    if (!email) {
        return res.status(400).json({
            status: 'error',
            message: 'Email not informed.'
        })
    }

    const user = new User({ username, email })

    User.register(user, password, err => {
        if (err) {
            return res.status(401).json({
                status: 'error',
                message: err.message
            })
        }

        res.status(200).json({
            status: 'success',
            message: `user '${username}' registered successfully`
        })
    })
})

auth.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
    const { _id: id, username } = req.user

    const token = jwt.sign({ id, username }, API_SECRET)

    const user = require('../../business/User')
    user.updateLastLogin(id)

    res.status(200).json({
        status: 'success',
        message: `user '${username}' authenticated successfully`,
        data: token
    })
})

auth.get('/revoke', function(req, res){
    const { _id: id, username } = req.user

    //req.logout()

    res.status(200).json({
        status: 'success',
        message: `user '${username}' logged out successfully`,
    })
    //res.redirect('/')
})

module.exports = auth
