const mongoose = require('mongoose');

const majorSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    cycle: {
        type: [String],
        enum: ['lmd', 'ing'],
        required: true,
    },
});

const Major = mongoose.model('Major', majorSchema);
module.exports = Major;
