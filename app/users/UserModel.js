const mongoose = require('mongoose')

const User = new mongoose.Schema({})

User.plugin(require('passport-local-mongoose'))

module.exports = mongoose.model('User', User)