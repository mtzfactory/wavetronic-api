const mongoose = require('mongoose')
mongoose.Promise = global.Promise

function init(url) {
	mongoose.connect(url, { useMongoClient: true })
}

module.exports = init