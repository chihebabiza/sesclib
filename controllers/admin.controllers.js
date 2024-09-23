const Major = require('../models/major.model');
const Year = require('../models/year.model');
const Submajor = require('../models/submajor.model');
const { connectDB, disconnectDB } = require('../config/db');

exports.getMajorsPage = async (req, res) => {
    try {
        await connectDB();
        const majors = await Major.find({});
        res.render('admin/getMajor', { majors });
    } catch (err) {
        console.error('Error fetching majors:', err);
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
    try {
        await connectDB();
        const submajors = await Submajor.find().populate('major years');
        res.render('admin/getSubmajor', { submajors });
    } catch (err) {
        console.error('Error fetching submajors:', err);
        res.status(500).send('Server Error');
    } finally {
        await disconnectDB();
    }
};

exports.getUpdateSubmajorPage = async (req, res) => {
    try {
        const majorId = req.params.id;
        await connectDB();
        const submajor = await Submajor.findById(majorId);
        const majors = await Major.find({});
        const years = await Year.find({});
        res.render('admin/updateSubmajor', { submajor, majors, years });
    } catch (err) {
        console.error('Error fetching submajor:', err);
        res.status(500).send('Server Error');
    } finally {
        await disconnectDB();
    }
};

exports.getAddSubmajorPage = async (req, res) => {
    try {
        await connectDB();
        const majors = await Major.find({});
        const years = await Year.find({});
        res.render('admin/addSubmajor', { majors, years });
    } catch (error) {
        console.error('Error fetching majors:', error);
        res.status(500).send('Server Error');
    } finally {
        await disconnectDB();
    }
};