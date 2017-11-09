const { DEBUG } = process.env

const { API_PORT } = process.env

const { MONGO_URL, MONGO_DB, MONGO_PORT } = process.env

const { PASSPORT_SECRET } = process.env

const { JAMENDO_CLIENT_ID } = process.env
const { JAMENDO_CLIENT_SECRET } = process.env
const JAMENDO_REDIRECT_URI = `http://localhost:${API_PORT}/jamendo/oauth2/callback`

module.exports = {
    DEBUG,
    API_PORT,
    MONGO_URL,
    MONGO_DB,
    MONGO_PORT,
    PASSPORT_SECRET,
    JAMENDO_CLIENT_ID,
    JAMENDO_CLIENT_SECRET,
    JAMENDO_REDIRECT_URI
}