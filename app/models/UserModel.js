const mongoose = require('mongoose')

const User = new mongoose.Schema({
    __v: { type: Number, select: false },
    email: String,
    verified: { type: Boolean, default: false },
    registered: { type: Date, default: Date.now },
    last_login: Date,
    friends: [ 
        {
            id: mongoose.Schema.Types.ObjectId,
            username: String,
            confirmed: { type: Boolean, default: false }
        }
    ],
    send_location: { type: Boolean, default: true },
    last_coordinates: [ Number ],
    playlists: [
        {
            name: String,
            description: String,
            creation_date: { type: Date, default: Date.now },
            tracks: [ Number ]
        }
    ]    
})

User.plugin(require('mongoose-paginate'))
User.plugin(require('passport-local-mongoose'))

module.exports = mongoose.model('User', User)