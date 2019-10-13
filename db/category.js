const mongoose = require('./db')
const { Schema } = mongoose

const categorySchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        index: true,
    }
})

module.exports = mongoose.model('Category', categorySchema)