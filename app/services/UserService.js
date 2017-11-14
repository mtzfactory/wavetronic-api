const debug = require('debug')('usr')
const User = require('../models/UserModel')

function validateOptions(options) {
    if (!options.page || typeof options.page !== 'number')
        throw new Error(`page cannot be ${options.page}`)

    if (!options.limit || typeof options.limit !== 'number')
        throw new Error(`limit cannot be ${options.limit}`)

    if (options.show && typeof options.show !== 'string')
        throw new Error(`show cannot be ${options.show}`)

    if (options.hide && typeof options.hide !== 'string')
        throw new Error(`hide cannot be ${options.hide}`)
}

class UserService {
    _getIdByUsername(username) {
        return this._query(() => {
            if (!username) throw new Error(`username cannot be ${username}`)
        }, { username }, { show: '_id' }, true)
        .then( ({ _id }) => _id)
    }

    _isInTheList(userId, list, condition) {
        const filter = {}; filter._id = userId; filter[list] = condition
        const projection = {}; projection._id = 0; projection[list] = 1
        
        return User.find(filter, projection).exec() // Para que devuelva un Promise.
    }

    _query(validate, conditions, options, single) {
        return Promise.resolve()
            .then(() => {
                if (validate) validate()

                if (!single) validateOptions(options)

                options.select = ''
                if (options.hide) // el orden es importante, hide primero...
                    options.select += options.hide.split(',').map(field => `-${field}`).join(' ')
                if (options.show)
                    options.select += ' ' + options.show.split(',').join(' ')

                return single
                    ? User.findOne(conditions, options.select) 
                    : User.paginate(conditions, options)
            })
    }

    updateLastLogin(userId) {
        return User.findOneAndUpdate(userId, { last_login: new Date() } )
            .exec() // Para que devuelva un Promise.
    }

    updateUserVerified(user, options) {
        return false
    }

// /user
    getUserProfile(userId) {
        debug('getUserProfile', userId)
        return this._query(() => {
                if (!userId) throw new Error(`userId cannot be ${user}`)
            }, { _id: userId }, { hide: '_id,playlists._id,friends._id' }, true)
    }

// /user/friends
    getFriends(userId, options) {
        debug('getFriends', userId)
        //return this._listAllMy('friends', userId, options)
        options.show = 'friends.username,friends.confirmed'
        return this._query(() => {
                if (!userId) throw new Error(`userId cannot be ${user}`)
            }, { _id: userId }, options, true)
    }

    addFriend(userId, friend) {
        debug('addFriend', userId, friend)
        return this._getIdByUsername(friend)
            .then( friendId => {
                return this._isInTheList(userId, 'friends', { $elemMatch: { username: friend } })
                    .then( friends => {
                        if (friends.length === 0) {
                            return  User.findOneAndUpdate(
                                userId,
                                { $push: { friends: { _id: friendId, username: friend } } },
                                { safe: true, upsert: true, new: true, fields: { _id: 0, 'friends.username': 1 } })
                                .exec() // Para que devuelva un Promise.
                        }
                        return null
                    })
            })
    }

// /user/friends/:friendId
    updateFriendship(userId, friend) {
        debug('updateFriendship', userId, friend)
        return User.findOneAndUpdate(
            { _id: userId, 'friends.username': friend },
            { 'friends.$.confirmed': true },
            { new: true, fields: { _id: 0, 'friends.username': 1, 'friends.confirmed': 1 } })
            .exec() // Para que devuelva un Promise.
    }

    removeFriend(userId, friend) {
        debug('removeFriend', userId, friend)
        return User.findOneAndUpdate(
            userId,
            { $pull: { friends: { username: friend } } },
            { new: true, fields: { _id: 0, 'friends.username': 1 } })
            .exec() // Para que devuelva un Promise.
    }

// /user/friends/:friendId/track/:trackId
    sendTrackToFriend(userId, friend, track) {
        return Promise.reject()
            .catch( () => { throw new Error('not implemented yet') })
    }

// /user/playlists
    getPlaylists(userId, options) {
        debug('getPlaylists', userId)
        //return this._listAllMy('playlists', userId, options)
        options.show = 'playlists.name,playlists._id,playlists.amount'
        return this._query(() => {
                if (!userId) throw new Error(`userId cannot be ${user}`)
            }, { _id: userId }, options, true)
    }

    addPlaylist(userId, name, description) {
        debug('addPlaylist', userId, name)
        return this._isInTheList(userId, 'playlists', { $elemMatch: { name } })
            .then( playlists => {
                if (playlists.length === 0) {
                    return  User.findOneAndUpdate(
                        userId,
                        { $push: { playlists: { name, description } } },
                        { safe: true, upsert: true, new: true, fields: { _id: 0, 'playlists._id': 1, 'playlists.name': 1, 'playlists.amount': 1 } })
                        .exec() // Para que devuelva un Promise.
                }
                return null
            })
    }

// /user/playlists/:playlistId
    getTracksFromPlaylist(userId, playlistId) {
        debug('getTracksFromPlaylist', userId, playlistId)
        return User.findOne({ _id: userId, 'playlists._id': playlistId }, { _id: 0, 'playlists.$.tracks': 1 })
            .exec()
    }

    removePlaylist(userId, playlistId) {
        debug('removePlaylist', userId, playlistId)
        return User.findOneAndUpdate(
            userId,
            { $pull: { playlists: { _id: playlistId } } },
            { new: true, fields: { _id: 0, 'playlists._id': 1, 'playlists.name': 1 } })
            .exec() // Para que devuelva un Promise.
    }

// /user/playlists/:playlistId/track/:trackId
    addTrackToPlaylist(userId, playlistId, track) {
        debug('addTrackToPlaylist', userId, playlistId, track)
        return User.find({ _id: userId, 'playlists._id': playlistId, 'playlists.tracks': {$in: [track] } })
            .exec()
            .then( playlists => {
                if (playlists.length === 0) {
                    return User.findOneAndUpdate(
                        { _id: userId, 'playlists._id': playlistId },
                        { $push: { 'playlists.$.tracks': track }, $inc: { 'playlists.$.amount' : 1 } },
                        { safe: true, upsert: true, new: true, fields: { _id: 0, playlists: { $elemMatch: { _id: playlistId } } } })
                        .exec() // Para que devuelva un Promise.
                }
                return null
            })
    }

    removeTrackFromPlaylist(userId, playlistId, track) {
        debug('removeTrackFromPlaylist', userId, playlistId)
        return User.findOneAndUpdate(
            { _id: userId, 'playlists._id': playlistId },
            { $pull: { 'playlists.$.tracks': track }, $inc: { 'playlists.$.amount' : -1 } },
            { new: true, fields: { _id: 0, playlists: { $elemMatch: { _id: playlistId } } } })
            .exec() // Para que devuelva un Promise.
    }

// /user/location
    updateLastCoordinates(userId, coordinates) {
        return false
    }
}
// exportamos uns singleton...
module.exports = new UserService()