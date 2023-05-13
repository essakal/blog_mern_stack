const mongoose = require("mongoose")
const { Schema } = require("mongoose")

const userModel = new Schema({
    email: { type: String, require: true, unique: true },
    username: { type: String, require: true, unique: true },
    password: { type: String, require: true, unique: true }
}, { collection: 'users' })

module.exports = mongoose.model('users', userModel, 'users')