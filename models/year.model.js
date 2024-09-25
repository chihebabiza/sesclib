const mongoose = require('mongoose');

const yearSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    semester: {
        type: [String],
        default: ['Semester 1', 'Semester 2']
    }
});

const Year = mongoose.model('Year', yearSchema);
module.exports = Year;