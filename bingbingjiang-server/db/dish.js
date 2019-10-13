const mongoose = require('./db')
const { Schema } = mongoose

const dishSchema = new Schema({
    name: String,
    price: Number,
    desc: String,
    imgUrls: [String],
    category: String
})

module.exports = mongoose.model('Dish', dishSchema)