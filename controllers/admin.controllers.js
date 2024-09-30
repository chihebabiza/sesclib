const Major = require('../models/major.model');
const Year = require('../models/year.model');
const Submajor = require('../models/submajor.model');
const Type = require('../models/type.model');
const Subject = require('../models/subject.model');
const Document = require('../models/document.model');
const User = require('../models/user.model');
const { connectDB, disconnectDB } = require('../config/db');

exports.getDashboard = async (req, res) => {
    try {
        await connectDB();
        const userCount = await User.countDocuments();
        const documentCount = await Document.countDocuments();
        const majorCount = await Major.countDocuments();
        const submajorCount = await Submajor.countDocuments();
        res.render('admin/dashboard', {
            page: 'admin', userCount, documentCount, majorCount, submajorCount, session: req.session
        });
    } catch (error) {
        console.error('Error opening dashboard:', error);
        res.render('user/error', { message: 'Error opening dashboard. Please try again later.', session: req.session });
    } finally {
        await disconnectDB();
    }
};

exports.getUsersDashboard = async (req, res) => {
    try {
        await connectDB();
        const users = await User.find().populate('specialty');
        console.log(users);
        res.render('admin/getUser', {
            page: 'users',
            users,
            session: req.session
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.render('user/error', { message: 'Error fetching users. Please try again later.', session: req.session });
    } finally {
        await disconnectDB();
    }
};

exports.getMajorsPage = async (req, res) => {
    try {
        await connectDB();
        const majors = await Major.find({});
        res.render('admin/getMajor', { majors, page: 'majors', session: req.session });
    } catch (error) {
        console.error('Error fetching majors:', error);
        res.render('user/error', { message: 'Error fetching majors. Please try again later.', session: req.session });
    } finally {
        await disconnectDB();
    }
};

exports.getUpdateMajorPage = async (req, res) => {
    try {
        const majorId = req.params.id;
        await connectDB();
        const major = await Major.findById(majorId);
        res.render('admin/updateMajor', { major, session: req.session });
    } catch (err) {
        console.error('Error fetching update major:', err);
        res.render('user/error', { message: 'Error fetching update major. Please try again later.', session: req.session });
    } finally {
        await disconnectDB();
    }
};

exports.getAddMajorPage = async (req, res) => {
    try {
        res.render('admin/addMajor', { session: req.session });
    } catch (err) {
        console.error('Error fetching add major:', err);
        res.render('user/error', { message: 'Error fetching add major. Please try again later.', session: req.session });
    }
};

exports.getSubmajorsPage = async (req, res) => {
    const majorId = req.params.id;
    try {
        await connectDB();
        const major = await Major.findById(majorId);
        const years = await Year.find({});
        if (!major) return res.status(404).send('Major not found');

        for (const year of years) {
            const submajors = await Submajor.find({ major: majorId, years: year._id });
            year.hasSubmajors = submajors.length > 0 ? submajors : [];
        }

        res.render('admin/getSubmajor', { major, years, page: 'submajors', session: req.session });
    } catch (error) {
        console.error('Error fetching submajors:', error);
        res.render('user/error', { message: 'Error fetching submajors. Please try again later.', session: req.session });
    } finally {
        await disconnectDB();
    }
};

exports.getUpdateSubmajorPage = async (req, res) => {
    const submajorId = req.params.id;
    try {
        await connectDB();

        const submajor = await Submajor.findById(submajorId).populate('years').populate('major');

        const majors = await Major.find();
        const allYears = await Year.find();
        const { error } = req.flash();

        res.render('admin/updateSubmajor', { error, submajor, majors, years: allYears, major: submajor.major, session: req.session });
    } catch (error) {
        console.error('Error fetching update submajor:', error);
        res.render('user/error', { message: 'Error fetching update submajor. Please try again later.', session: req.session });
    } finally {
        await disconnectDB();
    }
};

exports.getAddSubmajorPage = async (req, res) => {
    try {
        await connectDB();
        const majorId = req.params.id;
        const major = await Major.findById(majorId);
        const years = await Year.find({});
        const { error } = req.flash();

        if (!major) {
            return res.status(404).send('Major not found');
        }

        res.render('admin/addSubmajor', { major, years, session: req.session, error });
    } catch (error) {
        console.error('Error fetching add major:', error);
        res.render('user/error', { message: 'Error fetching add major. Please try again later.', session: req.session });
    } finally {
        await disconnectDB();
    }
};

exports.getAddSubjectPage = async (req, res) => {
    try {
        await connectDB();
        const { majorId, yearId } = req.params;

        const major = await Major.findById(majorId);
        if (!major) return res.status(404).send('Major not found');

        const year = await Year.findById(yearId);
        if (!year) return res.status(404).send('Year not found');

        const types = await Type.find();
        const { error } = req.flash();

        res.render('admin/addSubject', {
            major, year, types, yearId, majorId, session: req.session, error
        });
    } catch (error) {
        console.error('Error fetching add subject:', error);
        res.render('user/error', { message: 'Error fetching add subject. Please try again later.', session: req.session });
    } finally {
        await disconnectDB();
    }
};

exports.getUpdateSubjectPage = async (req, res) => {
    try {
        await connectDB();

        const { majorId, yearId, id } = req.params;

        const major = await Major.findById(majorId);
        if (!major) {
            return res.status(404).send('Major not found');
        }
        const subject = await Subject.findById(id);
        if (!subject) {
            return res.status(404).send('Subject not found');
        }
        const year = await Year.findById(yearId);
        if (!year) {
            return res.status(404).send('Year not found');
        }

        const types = await Type.find();
        const { error } = req.flash();

        res.render('admin/updateSubject', { subject, major, year, types, session: req.session, error });
    } catch (error) {
        console.error('Error fetching subject for update:', error);
        res.render('user/error', { message: 'Error fetching subject for update. Please try again later.', session: req.session });
    } finally {
        await disconnectDB();
    }
};

exports.getSubjects = async (req, res) => {
    try {
        await connectDB();
        const { majorId, yearId, submajorId } = req.params;

        const major = await Major.findById(majorId);
        if (!major) return res.status(404).send('Major not found');

        const year = await Year.findById(yearId);
        if (!year) return res.status(404).send('Year not found');

        let submajor;
        if (submajorId) {
            submajor = await Submajor.findById(submajorId);
            if (!submajor) return res.status(404).send('Submajor not found');
        }

        let subjects;
        if (submajor) {
            subjects = await Subject.find({ major: majorId, year: yearId, submajor: submajorId })
                .populate('types')
                .sort({ semester: 1 });
        } else {
            subjects = await Subject.find({ major: majorId, year: yearId, submajor: null })
                .populate('types')
                .sort({ semester: 1 });
        }

        res.render('admin/getSubject', {
            major, year, submajor, subjects, page: 'subjects', session: req.session
        });
    } catch (error) {
        console.error('Error fetching subjects:', error);
        res.render('user/error', { message: 'Error fetching subjects. Please try again later.', session: req.session });
    } finally {
        await disconnectDB();
    }
};

exports.getDocuments = async (req, res) => {
    try {
        await connectDB();

        const { subjectId } = req.params;

        const subject = await Subject.findById(subjectId)
            .populate('major')
            .populate('year');


        if (!subject) {
            return res.status(404).send('Subject not found');
        }

        const documents = await Document.find({ subject: subjectId }).populate('type');

        res.render('admin/getDocument', { documents, subject, page: 'documents', session: req.session });
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.render('user/error', { message: 'Error fetching documents. Please try again later.', session: req.session });
    } finally {
        await disconnectDB();
    }
};

exports.getAddDocumentPage = async (req, res) => {
    try {
        await connectDB();
        const { subjectId } = req.params;
        const { error } = req.flash();
        const subject = await Subject.findById(subjectId)
            .populate('types')

        if (!subject) {
            return res.status(404).send('Subject not found');
        }

        res.render('admin/addDocument', {
            subject, types: subject.types, session: req.session, error
        });
    } catch (error) {
        console.error('Error fetching subject or types:', error);
        res.render('user/error', { message: 'Error fetching subject or types. Please try again later.', session: req.session });
    } finally {
        await disconnectDB();
    }
};

exports.getUpdateDocumentPage = async (req, res) => {
    try {
        await connectDB();
        const { subjectId, id } = req.params;
        const { error } = req.flash();
        const subject = await Subject.findById(subjectId)
            .populate('types');

        if (!subject) {
            return res.status(404).send('Subject not found');
        }

        const document = await Document.findById(id).populate('type');

        if (!document) {
            return res.status(404).send('Document not found');
        }
        console.log(subject, document);

        res.render('admin/updateDocument', {
            subject, document, session: req.session
        });
    } catch (error) {
        console.error('Error fetching subject or document:', error);
        res.render('user/error', { message: 'Error fetching subject or document. Please try again later.', session: req.session });
    } finally {
        await disconnectDB();
    }
};

exports.get404 = (req, res) => {
    res.status(404).render('user/404');
};