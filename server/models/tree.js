const mongoose = require('mongoose')

const treeSchema = new mongoose.Schema({
    data: {
        type: Object,
        required: true
    },
    type: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Tree', treeSchema)