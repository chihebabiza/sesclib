const Major = require('../models/major.model');
const Year = require('../models/year.model');
const Submajor = require('../models/submajor.model');
const Subject = require('../models/subject.model');
const Type = require('../models/type.model');
const { connectDB, disconnectDB } = require('../config/db');

exports.getHome = async (req, res) => {
    try {
        await connectDB();
        const majors = await Major.find({});
        res.render('user/index', { majors, page: 'home' });
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
            const submajors = await Submajor.find({ major: majorId, years: year._id });
            year.hasSubmajors = submajors.length > 0 ? submajors : [];

            for (const submajor of submajors) {
                submajor.subjects = await Subject.find({ major: majorId, year: year._id, submajor: submajor._id })
                    .populate('types'); 
            }

            year.subjects = await Subject.find({ major: majorId, year: year._id, submajor: null })
                .populate('types'); 
        }

        res.render('user/major', { major, years });
    } catch (error) {
        console.error('Error fetching subjects:', error);
        res.status(500).send('Server Error');
    } finally {
        await disconnectDB();
    }
};

exports.getLogin = async (req, res) => {
    try {
        res.render('user/login', { page: 'login' })
    } catch (error) {
        res.status(500).send('Error fetching home page: ' + error.message);
    }
};

exports.getRegister = async (req, res) => {
    try {
        await connectDB();
        const majors = await Major.find({});
        res.render('user/register', { page: 'register', majors })
    } catch (error) {
        res.status(500).send('Error fetching home page: ' + error.message);
    } finally {
        await disconnectDB();
    }
};