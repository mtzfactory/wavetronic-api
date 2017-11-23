const FCM = require('fcm-push')

const uuidv4 = require('uuid/v4')
const { FCM_SERVER_KEY } = require('../constants')

class PushNotification {
    constructor () {
        this.fcm = new FCM(FCM_SERVER_KEY)
    }

    sendNotification (deviceToken, message) {
        const id = uuidv4()
        var message = {
            to: deviceToken, // required fill with device token or topics
            data: {
                friend: message.from,
                track: JSON.stringify(message.track),
                custom_notification: JSON.stringify({
                    title: message.title,
                    body: message.body,
                    sound: 'default',
                    show_in_foreground: true,
                    id
                }),
                id,
            },
            // notification: {
            //     title: message.title,
            //     body: message.body,
            //     sound: 'default'
            // },
            priority: 'high',
            show_in_foreground: true,
            content_available: true,
            time_to_live: 60 * 60 * 24
        }

        return this.fcm.send(message)
    }
}

module.exports = new PushNotification()