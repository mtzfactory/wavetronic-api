const debug = require('debug')('usr')
const userData = require('../data/UserData')
const pushNotification = require('../fcm')

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
            .then( docs => {
                return userData.getAllMyFriends(userId, {})
                    .then( total => {
                        docs.results_count = docs.friends.length
                        docs.results_fullcount = total.length
                        return docs
                    })
            })
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
                        //.then(friends => { return friends.filter(f => f.username === friend) })
                }

                throw new Error(
                    res.friendId
                    ? `'${friend}' is already a friend.`
                    : `'${friend}' does not exist.`
                )
            })
    }

// /user/friends/:friend
    updateFriendship (userId, friend) {
        debug('updateFriendship', userId, friend)
        return userData.updateFriendship(userId, friend)
            .then(friends => {
                //if (friends) { return friends.filter(f => f.username === friend) }
                if (friends) return friends

                throw new Error(`'${friend}' is not your friend.`)
            })
    }

    removeFriend (userId, friend) {
        debug('removeFriend', userId, friend)
        return userData.removeFriend(userId, friend)
            // .then(friends => { if (friends) { return friends.length } })
    }

// /user/friends/:friendId/track/:trackId
    sendTrackToFriend (user, userId, friendId, trackId) {
        debug('sendTrackToFriend', userId, friendId)
        return userData.retrieveFriendById(userId, friendId)
            .then( friend => {
                if (friend && friend.confirmed) {
                    return userData.retrievePnTokenById(friendId) 
                        .then(pnToken => {
                            if (!pnToken)
                                throw new Error(`User ${friend.username} has no PN token.`)

                            const { push_notification_token } = pnToken
                            const message = {
                                from: user,
                                track_title: trackId,
                                title: `${user} sent you this track`,
                                body: 'hope you enjoy it!',
                            }
                            return pushNotification.sendNotification(push_notification_token, message)
                        })
                }

                throw new Error(
                    friend
                    ? `'${friend.username}' is not a confirmed friend.`
                    : `'${friendId}' does not exist.`
                )
            })
    }

// /user/playlists
    getPlaylists (userId, options) {
        debug('getPlaylists', userId)
        return userData.getPlaylists(userId, options)
            .then( docs => {
                return userData.getAllMyPlaylists(userId, {})
                    .then( total => {
                        docs.results_count = docs.playlists.length
                        docs.results_fullcount = total.length
                        return docs
                    })
            })
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
                        //.then(playlists => { return playlists.filter(p => p.name === playlist) })

                throw new Error(`${playlist} already exist.`)
            })
    }

// /user/playlists/:playlistId
    getTracksFromPlaylist (userId, playlistId) {
        debug('getTracksFromPlaylist', userId, playlistId)
        return userData.getTracksFromPlaylist(userId, playlistId)
    }

    removePlaylist (userId, playlistId) {
        debug('removePlaylist', userId, playlistId)
        return userData.removePlaylist(userId, playlistId)
            // .then(playlists => { if (playlists) { return playlists.length } })
    }

// /user/playlists/:playlistId/track/:trackId
    isTrackAlredyInThePlaylist (userId, playlistId, track) {
        return userData.getTracksFromPlaylist (userId, playlistId)
            .then(tracks => {
                return tracks
                    ? tracks.filter( t => t == track)
                    : null
            })
    }

    addTrackToPlaylist (userId, playlistId, track) {
        debug('addTrackToPlaylist', userId, playlistId, track)
        return this.isTrackAlredyInThePlaylist(userId, playlistId, track)
            .then(tracks => {
                if (!tracks || tracks.length === 0) {
                    return userData.addTrackToPlaylist(userId, playlistId, track)
                        //.then(tracks => { return tracks.filter(t => t == track) })
                }

                throw new Error(`'${track}' alredy in '${playlistId}'.`)
            })
    }

    removeTrackFromPlaylist(userId, playlistId, track) {
        debug('removeTrackFromPlaylist', userId, playlistId)
        return userData.removeTrackFromPlaylist(userId, playlistId, track)
            // .then(tracks => { if (tracks) { return tracks.length } })
    }

// /user/location
    updateLastCoordinates(userId, coordinates) {
        return false
    }
}
// exportamos uns singleton...
module.exports = new User()
