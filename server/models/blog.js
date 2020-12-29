const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    genre: {
        type: String
    },
    content: {
        type: String
    },
    author: {
        type: String
    },
    img: {
        type: String
    },
    created: {
        type: String
    }
})

module.exports = mongoose.model('Blog', blogSchema)