const Major = require('../models/major.model');
const Year = require('../models/year.model');
const Submajor = require('../models/submajor.model');
const Subject = require('../models/subject.model');
const Type = require('../models/type.model');
const Document = require('../models/document.model');
const { connectDB, disconnectDB } = require('../config/db');

exports.getHome = async (req, res) => {
    try {
        await connectDB();
        const majors = await Major.find({});
        res.render('user/index', { majors, page: 'home', session: req.session });
    } catch (error) {
        res.status(500).send('Error fetching home page: ' + error.message);
    } finally {
        await disconnectDB();
    }
};

exports.getResourses = async (req, res) => {
    try {
        await connectDB();
        const majors = await Major.find({});
        res.render('user/resourses', { majors, page: 'resources', session: req.session });
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

                for (const subject of submajor.subjects) {
                    for (const type of subject.types) {
                        type.documents = await Document.find({ type: type._id, subject: subject._id });
                    }
                }
            }

            year.subjects = await Subject.find({ major: majorId, year: year._id, submajor: null })
                .populate('types');

            for (const subject of year.subjects) {
                for (const type of subject.types) {
                    type.documents = await Document.find({ type: type._id, subject: subject._id });
                }
            }
        }

        res.render('user/major', { major, years, majorId, page: 'resources', session: req.session });
    } catch (error) {
        console.error('Error fetching subjects and documents:', error);
        res.status(500).send('Server Error');
    } finally {
        await disconnectDB();
    }
};

exports.getLogin = (req, res) => {
    const { success, error } = req.flash();
    res.render('user/login', { page: 'login', success, error });
};

exports.getRegister = async (req, res) => {
    try {
        await connectDB();

        const success = req.flash('success');
        const error = req.flash('error');

        const majors = await Major.find({});

        res.render('user/register', {
            page: 'register',
            majors,
            success,
            error
        });
    } catch (err) {
        res.status(500).send('Error fetching registration page: ' + err.message);
    } finally {
        await disconnectDB();
    }
};

exports.getDocuments = async (req, res) => {
    try {
        const { type, subjectId, majorId } = req.params;

        await connectDB();

        const typeDocument = await Type.findOne({ name: type });
        if (!typeDocument) {
            return res.status(404).send('Type not found');
        }

        const documents = await Document.find({ subject: subjectId, type: typeDocument._id });

        const subject = await Subject.findById(subjectId);
        if (!subject) {
            return res.status(404).send('Subject not found');
        }

        res.render('user/document', { documents, subject, type, majorId });
    } catch (err) {
        console.error('Error fetching documents:', err);
        res.status(500).send('Server Error');
    } finally {
        await disconnectDB();
    }
};

exports.getAbout = (req, res) => {
    try {
        res.render('user/about', { page: 'about', session: req.session })
    } catch (err) {
        res.status(500).send('Error fetching home page: ' + err.message);
    }
}

exports.getContact = (req, res) => {
    try {
        res.render('user/contact', { page: 'contact', session: req.session })
    } catch (err) {
        res.status(500).send('Error fetching home page: ' + err.message);
    }
}