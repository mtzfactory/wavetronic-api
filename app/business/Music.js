const { JAMENDO_CLIENT_ID } = require('../constants')
const { jamendo } = require('../jamendo')

class MusicBusiness {
    constructor() {
        this.parameters = {
            client_id: JAMENDO_CLIENT_ID,
            format: 'jsonpretty',
            fullcount: true,
        }
    }

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

    getTracksByAlbum (options) {
      return new Promise((resolve, reject) => {
          if (options) Object.assign(options, this.parameters)

          console.log(options)

          jamendo.album_tracks(options, function(error, body) {
              if (error)
                  return reject(error.message)

              resolve(body)
          })
      })
    }

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

// exportamos uns singleton...
module.exports = new MusicBusiness()
