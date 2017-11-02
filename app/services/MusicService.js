const { JAMENDO_CLIENT_ID } = require('../constants')
const { jamendo } = require('../jamendo')

class MusicService {
    constructor() {
        this.parameters = {
            client_id: JAMENDO_CLIENT_ID,
            format: 'jsonpretty',
            fullcount: true,
        }
    }

    // getTracks (options, cb) {
    //     if (options) Object.assign(options, this.parameters)
    
    //     jamendo.tracks(options, function(error, body) {
    //         if (error)
    //             return cb(null, error)
            
    //         cb(body, null)
    //     })
    // }

    getTracks(options) {
        return new Promise((resolve, reject) => {
            if (options) Object.assign(options, this.parameters)
            
            jamendo.tracks(options, function (error, body) {
                if (error)
                    return reject(error)

                resolve(body)
            })
        })
    }

    // getAlbums (options, cb) {
    //     if (options) Object.assign(options, this.parameters)
    
    //     jamendo.albums(options, function(error, body) {
    //         if (error)
    //             return cb(null, error)
            
    //         cb(body, null)
    //     })
    // }

    getAlbums (options) {
        return new Promise((resolve, reject) => {
            if (options) Object.assign(options, this.parameters)
    
            jamendo.albums(options, function(error, body) {
                if (error)
                    return reject(error)
            
                resolve(body)
            })
        })
    }
    
    // getPlaylists (options, cb) {
    //     if (options) Object.assign(options, this.parameters)
    
    //     jamendo.playlists(options, function(error, body) {
    //         if (error)
    //             return cb(null, error)
        
    //         cb(body, null)
    //     })
    // }

    getPlaylists (options) {
        return new Promise((resolve, reject) => {
            if (options) Object.assign(options, this.parameters)

            jamendo.playlists(options, function(error, body) {
                if (error)
                    return reject(error)
            
                resolve(body)
            })
        })
    }
    
    // getPlaylistTracks (options, cb) {
    //     if (options) Object.assign(options, this.parameters)
        
    //     jamendo.playlists_tracks(options, function(error, body) {
    //         if (error)
    //             return cb(null, error)
        
    //         cb(body, null)
    //     })
    // }

    getPlaylistTracks (options) {
        return new Promise((resolve, reject) => {
            if (options) Object.assign(options, this.parameters)
        
            jamendo.playlists_tracks(options, function(error, body) {
                if (error)
                    return reject(error)
            
                resolve(body)
            })
        })
    }
}

module.exports = new MusicService()