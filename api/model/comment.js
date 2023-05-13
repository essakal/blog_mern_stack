const mongoose = require("mongoose")
const { Schema } = require("mongoose")

const cmtModel = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    cmt: { type: String, require: true},
}, { collection: 'comments' })

module.exports = mongoose.model('comments', cmtModel, 'comments')