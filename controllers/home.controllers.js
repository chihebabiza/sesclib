const Major = require('../models/major.model');
const Year = require('../models/year.model');
const Submajor = require('../models/submajor.model');
const { connectDB, disconnectDB } = require('../config/db');

exports.getHome = async (req, res) => {
    try {
        await connectDB();
        const majors = await Major.find({});
        res.render('user/index', { majors });
    } catch (error) {
        res.status(500).send('Error fetching home page: ' + error.message);
    } finally {
        await disconnectDB();
    }
};

exports.getMajor = async (req, res) => {
    try {
        await connectDB();
        const majorId = req.params.id;
        const major = await Major.findById(majorId);
        if (!major) return res.status(404).send('Major not found');

        const years = await Year.find();

        for (const year of years) {
            const submajors = await Submajor.find({ major: majorId, years: year.name });
            year.hasSubmajors = submajors.length > 0 ? submajors : [];
        }

        res.render('user/major', { major, years });
    } catch (error) {
        console.error('Error fetching majors:', error);
        res.status(500).send('Server Error');
    } finally {
        await disconnectDB();
    }
};