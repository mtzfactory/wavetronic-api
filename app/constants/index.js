const { DEBUG } = process.env

const { PORT, API_PORT, API_SECRET } = process.env
if (!PORT)
    PORT = API_PORT

const { MONGO_HOST, MONGO_DB, MONGO_PORT, MONGO_USER, MONGO_PASS } = process.env

const { JAMENDO_CLIENT_ID } = process.env
const { JAMENDO_CLIENT_SECRET } = process.env
const JAMENDO_REDIRECT_URI = `http://localhost:${API_PORT}/jamendo/oauth2/callback`

module.exports = {
    DEBUG,
    PORT,
    API_SECRET,
    MONGO_HOST,
    MONGO_DB,
    MONGO_PORT,
    MONGO_USER,
    MONGO_PASS,
    JAMENDO_CLIENT_ID,
    JAMENDO_CLIENT_SECRET,
    JAMENDO_REDIRECT_URI
}