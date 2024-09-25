const mongoose = require('mongoose');

const submajorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    major: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Major',
        required: true
    },
    years: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Year',
        required: true
    }
});

const Submajor = mongoose.model('Submajor', submajorSchema);

module.exports = Submajor;
