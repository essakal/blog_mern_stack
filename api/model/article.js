const mongoose = require("mongoose")
const { Schema } = require("mongoose")

const articleModel = new Schema({
    title: { type: String, require: true, unique: true },
    image: { type: String, require: true},
    content: { type: String, require: true},
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    category: [String],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'comments' }]
}, { collection: 'articles' })

module.exports = mongoose.model('articles', articleModel, 'articles')