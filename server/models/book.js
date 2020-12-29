const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    genre: {
        type: String
    },
    size: {
        type: String
    },
    pages: {
        type: String
    }
})

// tribeSchema.pre("findOneAndUpdate", function(next) {
//     const img = this.getUpdate().img;
//     // this.getUpdate().img = {data: img.dataURL, contentType: 'image/png'}
//     this.getUpdate().img = img.dataURL
//     return next
// });

module.exports = mongoose.model('Book', bookSchema)