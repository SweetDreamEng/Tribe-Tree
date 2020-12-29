const mongoose = require('mongoose')

const bioSchema = new mongoose.Schema({
    nodeId: {
        type: String,
        required: true
    },
    descEn: {
        type: String
    },
    descAr: {
        type: String
    },
    descUr: {
        type: String
    },
    files: {
        type: Array
    },
    dod: {
        type: Number
    },
    content: {
        type: String
    }
})

module.exports = mongoose.model('Bio', bioSchema)