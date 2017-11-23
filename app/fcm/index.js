const FCM = require('fcm-push')

const { FCM_SERVER_KEY } = require('../constants')

class PushNotification {
    constructor () {
        this.fcm = new FCM(FCM_SERVER_KEY)
    }

    sendNotification (deviceToken, message) {
        var message = {
            to: deviceToken, // required fill with device token or topics
            data: {
                friend: message.from,
                track: message.track,
                // priority: 'high',
                // show_in_foreground: true,
                // time_to_live: 60 * 60 * 24,
                custom_notification: JSON.stringify({
                    title: message.title,
                    body: message.body,
                    sound: 'default',
                    show_in_foreground: true
                })
            },
            // notification: {
            //     title: message.title,
            //     body: message.body,
            //     sound: 'default'
            // },
            priority: 'high',
            // showInForeground: true,
            // show_in_foreground: true,
            // contentAvailable: true,
            content_available: true,
            // timeToLive: 60 * 60 * 24,
            time_to_live: 60 * 60 * 24
        }

        return this.fcm.send(message)
    }
}

module.exports = new PushNotification()