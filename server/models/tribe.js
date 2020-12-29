const mongoose = require('mongoose')

const tribeSchema = new mongoose.Schema({
    nameAr: {
        type: String
    },
    nameEn: {
        type: String,
        required: true
    },
    region: {
        type: String,
        enum: ['asia', 'middleEast']
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
    type: {
        type: String
    },
    content: {
        // contentType: String,
        // data: Buffer
        type: String
    },
    leader: {
        type: String
    }
})

// tribeSchema.pre("findOneAndUpdate", function(next) {
//     const img = this.getUpdate().img;
//     // this.getUpdate().img = {data: img.dataURL, contentType: 'image/png'}
//     this.getUpdate().img = img.dataURL
//     return next
// });

module.exports = mongoose.model('Tribe', tribeSchema)