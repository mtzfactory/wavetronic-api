const passport = require('passport')
const passportJwt = require('passport-jwt')
const User = require('../users/UserModel')

function init(secret) {
    passport.use(User.createStrategy())

    const options = {
        secretOrKey: secret,
        jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken()
    }

    passport.use(new passportJwt.Strategy(options, (payload, done) => {
        User.findById(payload.id)
            .then(user => done(null, user ? user : false))
            .catch(err => done(err, false))
    }))

    return passport.initialize()
}

module.exports = init