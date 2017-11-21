const User = require('./models/UserModel')

function validateOptions (options) {
    if (!options.page || typeof options.page !== 'number')
        throw new Error(`page cannot be ${options.page}`)

    if (!options.limit || typeof options.limit !== 'number')
        throw new Error(`limit cannot be ${options.limit}`)

    if (options.show && typeof options.show !== 'string')
        throw new Error(`show cannot be ${options.show}`)

    if (options.hide && typeof options.hide !== 'string')
        throw new Error(`hide cannot be ${options.hide}`)
}

function normalizePlaylist (data) {
    return data.playlists.map(function(item) {
        return {
          id: item._id,
          name: item.name,
          description: item.description,
          amount: itme.amount,
          creation_date: item.creation_date,
          last_modified: item.last_modified
        }
    })
}

class UserData {
    _isInTheList (userId, list, condition) {
        const filter = {}; filter._id = userId; filter[list] = condition
        const projection = {}; projection._id = 0; projection[list + '.$'] = 1

        return User.findOne(filter, projection).exec() // Para que devuelva un Promise.
        //return User.find(filter, projection).exec() // Para que devuelva un Promise.
    }

    _query (validate, conditions, options, single) {
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

    updateLastLogin (userId) {
        return User.findOneAndUpdate(userId, { last_login: new Date() } )
            .exec() // Para que devuelva un Promise.
    }

    updateUserVerified (user, options) {
        return false
    }

    getIdByUsername (username) {
        return this._query(() => {
                if (!username) throw new Error(`username cannot be ${username}`)
            }, { username }, { show: '_id' }, true)
            .then( docs => { return docs ? docs.id : null })
    }

// /user
    getUserProfile (userId) {
        return this._query(() => {
                if (!userId) throw new Error(`userId cannot be ${user}`)
            }, { _id: userId }, { hide: '_id,playlists._id,friends._id' }, true)
    }

    updatePushNotificationToken(userId, pnToken) {
        return User.findOneAndUpdate(
            { _id: userId },
            { 'push_notification_token': pnToken },
            { new: true, fields: { '_id': 0, 'username': 1, 'push_notification_token': 1 } })
            .exec() // Para que devuelva un Promise.
    }

// /user/friends
    getFriends (userId, options) {
        options.show = 'friends._id,friends.username,friends.confirmed'
        return this._query(() => {
                if (!userId) throw new Error(`userId cannot be ${user}`)
            }, { _id: userId }, options, true)
            .then(({friends}) => friends)
    }

    retrieveFriendById (userId, friendId) {
        return this._isInTheList(userId, 'friends', { $elemMatch: { _id: friendId } })
            .then(docs => { return docs ? docs.friends[0] : null })
    }

    addFriend (userId, friendId, friend) {
        console.log('data -> addFriend userId', userId, friendId, friend)
        return  User.findOneAndUpdate(
            { _id: userId },
            { $push: { friends: { _id: friendId, username: friend } } },
            { safe: true, upsert: false, new: true, fields: { 'friends.username': 1, 'friends.confirmed': 1 } })
            .exec() // Para que devuelva un Promise.
            .then(({friends}) => friends)
    }

// /user/friends/:friendId
    updateFriendship (userId, friend) {
        return User.findOneAndUpdate(
            { _id: userId, 'friends.username': friend },
            { 'friends.$.confirmed': true },
            { new: true, fields: { 'friends.username': 1, 'friends.confirmed': 1 } })
            .exec() // Para que devuelva un Promise.
            .then(({friends}) => friends)
    }

    removeFriend (userId, friend) {
        return User.findOneAndUpdate(
            { _id: userId },
            { $pull: { friends: { username: friend } } },
            { new: true, fields: { 'friends.username': 1, 'friends.confirmed': 1 } })
            .exec() // Para que devuelva un Promise.
            .then(({friends}) => friends)
    }

// /user/friends/:friendId/track/:trackId
    sendTrackToFriend (userId, friend, track) {
        return Promise.resolve()
            .then( () => { throw new Error('not implemented yet') })
    }

// /user/playlists/all
    getAllMyPlaylists (userId, options) {
        options.show = 'playlists.name,playlists._id,playlists.description,playlists.amount'
        return this._query(() => {
                if (!userId) throw new Error(`userId cannot be ${user}`)
            }, { _id: userId }, options, true)
            .then(({playlists}) => playlists)
    }

// /user/playlists
    getPlaylists (userId, options) {
        options.show = 'playlists.name,playlists._id,playlists.amount,playlists.creation_date,playlists.description,playlists.last_modified'
        return this._query(() => {
                if (!userId) throw new Error(`userId cannot be ${user}`)
            }, { _id: userId }, options, false)
            //.then(({docs:{playlists}}) => playlists)
    }

    retrievePlaylistIdByName (userId, name) {
        return this._isInTheList(userId, 'playlists', { $elemMatch: { name } })
    }

    addPlaylist (userId, name, description) {
        const fields = {
          'playlists._id': 1,
          'playlists.name': 1,
          'playlists.amount': 1,
          'playlists.creation_date': 1,
          'playlists.last_modified': 1,
          'playlists.description': 1
        }
        return User.findOneAndUpdate(
            { _id: userId },
            { $push: { playlists: { name, description } } },
            { safe: true, upsert: true, new: true, fields })
            .exec() // Para que devuelva un Promise.
            .then(({playlists}) => playlists)
    }

// /user/playlists/:playlistId
    getTracksFromPlaylist (userId, playlistId) {
        const projection = { _id: 0, 'playlists.$.tracks': 1 }
        return User.findOne({ _id: userId, 'playlists._id': playlistId }, projection)
            .exec()
            .then(({playlists}) => playlists[0].tracks)
            //.then(({playlists:{tracks}}) => { console.log(tracks); return tracks})
    }

    removePlaylist (userId, playlistId) {
        const fields = {
          'playlists._id': 1,
          'playlists.name': 1,
          'playlists.amount': 1,
          'playlists.creation_date': 1,
          'playlists.last_modified': 1,
          'playlists.description': 1
        }

        return User.findOneAndUpdate(
            { _id: userId },
            { $pull: { playlists: { _id: playlistId } } },
            { new: true, fields })
            .exec() // Para que devuelva un Promise.
            .then(({playlists}) => playlists)
    }

// /user/playlists/:playlistId/track/:trackId
    isTrackAlredyInThePlaylist (userId, playlistId, track) {
        const projection = { _id: 0, 'playlists.$.tracks': 1 }
        return User.findOne({ _id: userId, 'playlists._id': playlistId, 'playlists.$.tracks': {$in: [track] } }, projection)
            .then(docs => { return docs ? docs.playlists[0] : null })
    }

    addTrackToPlaylist (userId, playlistId, track) {
        return User.findOneAndUpdate(
            { _id: userId, 'playlists._id': playlistId },
            { $push: { 'playlists.$.tracks': track },
              $inc: { 'playlists.$.amount': 1 },
              $currentDate: { 'playlists.$.last_modified': true }
            },
            { safe: true, new: true, fields: { 'playlists.tracks': 1 } })
            .exec() // Para que devuelva un Promise.
            .then(({playlists}) => playlists[0])
    }

    removeTrackFromPlaylist(userId, playlistId, track) {
        return User.findOneAndUpdate(
            { _id: userId, 'playlists._id': playlistId },
            { $pull: { 'playlists.$.tracks': track },
              $inc: { 'playlists.$.amount' : -1 },
              $currentDate: { 'playlists.$.last_modified': true }
            },
            { safe:true, new: true, fields: { 'playlists.tracks': 1 } })
            .exec() // Para que devuelva un Promise.
            .then(({playlists}) => playlists[0])
    }

// /user/location
    updateLastCoordinates(userId, coordinates) {
        return false
    }
}
// exportamos uns singleton...
module.exports = new UserData()
