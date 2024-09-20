const mongoose = require('mongoose');

const subMajorSchema = new mongoose.Schema({
    majorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Major',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    years: {
        type: [String],
        required: true
    }
});

const SubMajor = mongoose.model('SubMajor', subMajorSchema);

module.exports = SubMajor;
