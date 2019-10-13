const mongoose = require('./db')
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: String,
    password: String
})

const UserModel = mongoose.model('User', userSchema)

module.exports = UserModel