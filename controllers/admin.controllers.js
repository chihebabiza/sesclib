const Major = require('../models/major.model');
const Year = require('../models/year.model');
const Submajor = require('../models/submajor.model');
const Type = require('../models/type.model');
const Subject = require('../models/subject.model');
const Document = require('../models/document.model');
const { connectDB, disconnectDB } = require('../config/db');

exports.getDashboard = async (req, res) => {
    try {
        res.render('admin/dashboard', { page: 'admin' });
    } catch (error) {
        console.error('Error opening dashboard:', error);
        res.status(500).send('Server Error');
    }
}

exports.getMajorsPage = async (req, res) => {
    try {
        await connectDB();
        const majors = await Major.find({});
        res.render('admin/getMajor', { majors, page: 'majors' });
    } catch (error) {
        console.error('Error fetching majors:', error);
        res.status(500).send('Server Error');
    } finally {
        await disconnectDB();
    }
};

exports.getUpdateMajorPage = async (req, res) => {
    try {
        const majorId = req.params.id;
        await connectDB();
        const major = await Major.findById(majorId);
        res.render('admin/updateMajor', { major });
    } catch (err) {
        console.error('Error fetching major:', err);
        res.status(500).send('Server Error');
    } finally {
        await disconnectDB();
    }
};

exports.getAddMajorPage = async (req, res) => {
    try {
        res.render('admin/addMajor');
    } catch (err) {
        console.error('Error fetching major:', err);
        res.status(500).send('Server Error');
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

        res.render('admin/getSubmajor', { major, years });
    } catch (error) {
        console.error('Error fetching subjects:', error);
        res.status(500).send('Server Error');
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

        res.render('admin/updateSubmajor', { submajor, majors, years: allYears, major: submajor.major });
    } catch (error) {
        console.error('Error fetching submajor:', error);
        res.status(500).send('Server Error');
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

        if (!major) {
            return res.status(404).send('Major not found');
        }

        res.render('admin/addSubmajor', { major, years });
    } catch (error) {
        console.error('Error fetching majors:', error);
        res.status(500).send('Server Error');
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

        res.render('admin/addSubject', {
            major,
            year,
            types,
            yearId,
            majorId
        });
    } catch (error) {
        console.error('Error fetching major:', error);
        res.redirect('/dashboard/subjects?error=FetchError');
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

        res.render('admin/updateSubject', { subject, major, year, types });
    } catch (error) {
        console.error('Error fetching subject for update:', error);
        res.redirect(`/dashboard/major/${req.params.majorId}/year/${req.params.yearId}/subjects?error=FetchSubjectError`);
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
            major,
            year,
            submajor,
            subjects
        });
    } catch (error) {
        console.error('Error fetching subjects by major, year, and submajor:', error);
        res.status(500).send('Server Error');
    } finally {
        await disconnectDB();
    }
};

exports.getDocuments = async (req, res) => {
    try {
        await connectDB();

        const { subjectId } = req.params; 
        console.log('subjectId', subjectId);

        const subject = await Subject.findById(subjectId)
            .populate('major') 
            .populate('year');  

        console.log('subject ', subject);

        if (!subject) {
            return res.status(404).send('Subject not found');
        }

        const documents = await Document.find({ subject: subjectId }).populate('type');
        console.log('documents', documents);

        res.render('admin/getDocument', { documents, subject });
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.redirect(`/dashboard/subject/${req.params.subjectId}/documents?error=FetchDocumentsError`);
    } finally {
        await disconnectDB();
    }
};