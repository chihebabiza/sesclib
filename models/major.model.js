const mongoose = require('mongoose');

const majorSchema = new mongoose.Schema({
    name: String,
    image: String
});

const Major = mongoose.model('Major', majorSchema);

module.exports = Major;
