const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    major: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Major',
        required: true
    },
    semester: {
        type: String,
        enum: ['Semester 1', 'Semester 2'],
        required: true
    },
    year: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Year',
        required: true
    },
    submajor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Submajor',
    },
    types: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Type',
        required: true
    }]
});

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;
