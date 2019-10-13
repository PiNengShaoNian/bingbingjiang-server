const mongoose = require('mongoose')

const DB_URL = 'mongodb://localhost:27017/bingbingjiang'

mongoose.set('useCreateIndex', true)
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true } )

module.exports = mongoose
