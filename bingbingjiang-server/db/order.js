const mongoose = require('./db')
const { Schema } = mongoose

const orderSchema = new Schema({
    date: Number,
    dishes: [{
        name: String,
        category: String,
        price: String,
        count: Number,
        id: String,
        imgUrls: [String]
    }],
    sum: Number,
    status: Number,
    count: Number
})

module.exports = mongoose.model('Order', orderSchema)