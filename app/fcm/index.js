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
                track_title: message.track_title,
                title: message.title,
                body: message.body
            },
            notification: {
                title: message.title,
                body: message.body,
                sound: 'default'
            },
            content_available: true,
            priority: "high",
            time_to_ive: 60 * 60 * 24
        }

        console.log(message)

        return this.fcm.send(message)
    }
}

module.exports = new PushNotification()