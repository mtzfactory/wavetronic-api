const { DEBUG } = process.env
const { PORT } = process.env
const { JAMENDO_CLIENT_ID } = process.env
const { JAMENDO_CLIENT_SECRET } = process.env
const JAMENDO_REDIRECT_URI = `http://localhost:${PORT}/oauth2/callback`

module.exports = {
    DEBUG,
    PORT,
    JAMENDO_CLIENT_ID,
    JAMENDO_CLIENT_SECRET,
    JAMENDO_REDIRECT_URI
  }