const debug = require('debug')('usr')
const userData = require('../data/UserData')

class User {
    updateLastLogin (userId) {
        return userData.updateLastLogin(userId)
    }

    updateUserVerified (user, options) {
        return false
    }

// /user
    getUserProfile (userId) {
        debug('getUserProfile', userId)
        return userData.getUserProfile(userId)
    }

    updatePushNotificationToken(userId, pnToken) {
        debug('updatePushNotificationToken', userId)
        return userData.updatePushNotificationToken(userId, pnToken)
    }

// /user/friends
    getFriends (userId, options) {
        debug('getFriends', userId)
        return userData.getFriends(userId, options)
    }

    areWeFriends (userId, friend) {
        debug('areWeFriends', userId, friend)
        return userData.getIdByUsername(friend)
            .then( friendId => {
                if (friendId) {
                    return userData.retrieveFriendById(userId, friendId)
                        .then( friend => {
                            if (friend)
                                return { friendship: true, friendId }
                            else
                                return { friendship: false, friendId }
                        })
                }
                else return { friendship: false, friendId: undefined }
            })
    }

    addFriend (userId, friend) {
        debug('addFriend', userId, friend)
        return this.areWeFriends(userId, friend)
            .then( res => {
                if (res.friendship === false && res.friendId) {
                    return userData.addFriend(userId, res.friendId, friend)
                }

                throw new Error(
                    res.friendId ?
                    `'${friend}' is already a friend.` :
                    `'${friend}' does not exist.`
                )
            })
    }

// /user/friends/:friendId
    updateFriendship (userId, friend) {
        debug('updateFriendship', userId, friend)
        return userData.updateFriendship(userId, friend)
            .then(docs => {
                if (docs) return docs

                throw new Error(`'${friend}' is not your friend.`)
            })
    }

    removeFriend (userId, friend) {
        debug('removeFriend', userId, friend)
        return userData.removeFriend(userId, friend)
            .then(docs => {
                if (docs) return docs

                throw new Error(`'${friend}' is not your friend.`)
            })
    }

// /user/friends/:friendId/track/:trackId
    sendTrackToFriend (userId, friendId, trackId) {
        return userData.sendTrackToFriend(userId, friendId, trackId)
    }

// /user/playlists/all
    getAllMyPlaylists (userId, options) {
        debug('getAllMyPlaylists', userId)
        return userData.getAllMyPlaylists(userId, options)
    }

// /user/playlists
    getPlaylists (userId, options) {
        debug('getPlaylists', userId)
        return userData.getPlaylists(userId, options)
    }

    existsThePlaylist (userId, playlist) {
        debug('existsThePlaylist', userId, playlist)
        return userData.retrievePlaylistIdByName(userId, playlist)
    }

    addPlaylist (userId, playlist, description) {
        debug('addPlaylist', userId, playlist)
        return this.existsThePlaylist(userId, playlist)
            .then(docs => {
                if (!docs)
                    return userData.addPlaylist(userId, playlist, description)

                throw new Error(`${playlist} already exist.`)
            })
    }

// /user/playlists/:playlistId
    getTracksFromPlaylist(userId, playlistId) {
        debug('getTracksFromPlaylist', userId, playlistId)
        return userData.getTracksFromPlaylist(userId, playlistId)
    }

    removePlaylist(userId, playlistId) {
        debug('removePlaylist', userId, playlistId)
        return userData.removePlaylist(userId, playlistId)
    }

// /user/playlists/:playlistId/track/:trackId
    addTrackToPlaylist(userId, playlistId, track) {
        debug('addTrackToPlaylist', userId, playlistId, track)
        return userData.isTrackAlredyInThePlaylist(userId, playlistId, track)
            .then(docs => {
                if (!docs) {
                    return userData.addTrackToPlaylist(userId, playlistId, track)
                }

                throw new Error(`'${track}' alredy in '${docs.name}'.`)
            })
    }

    removeTrackFromPlaylist(userId, playlistId, track) {
        debug('removeTrackFromPlaylist', userId, playlistId)
        return userData.removeTrackFromPlaylist(userId, playlistId, track)
    }

// /user/location
    updateLastCoordinates(userId, coordinates) {
        return false
    }
}
// exportamos uns singleton...
module.exports = new User()
