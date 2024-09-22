const Major = require('../models/major.model');
const Year = require('../models/year.model');
const { connectDB, disconnectDB } = require('../config/db');

exports.getAllMajors = async () => {
    try {
        await connectDB();
        return await Major.find({});
    } catch (error) {
        console.error('Error fetching majors:', error);
        throw error;
    } finally {
        await disconnectDB();
    }
};

exports.getMajorById = async (id) => {
    try {
        await connectDB();
        return await Major.findById(id) || null;
    } catch (error) {
        console.error('Error retrieving major by ID:', error);
    } finally {
        await disconnectDB();
    }
};

exports.deleteMajor = async (req, res) => {
    try {
        await connectDB();
        await Major.findByIdAndDelete(req.params.id);
        res.redirect('/dashboard/majors');
    } catch (error) {
        console.error('Error deleting major:', error);
        res.status(500).send('Server Error');
    } finally {
        await disconnectDB();
    }
};

exports.updateMajor = async (req, res) => {
    try {
        await connectDB();
        const { id } = req.params;
        const { name } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : undefined;

        const updatedMajor = await Major.findByIdAndUpdate(id, { name, ...(image && { image }) }, { new: true });
        if (!updatedMajor) return res.redirect('/dashboard/majors');

        res.redirect('/dashboard/majors');
    } catch (error) {
        console.error('Error updating major:', error);
        res.redirect('/dashboard/majors');
    } finally {
        await disconnectDB();
    }
};

exports.addMajor = async (req, res) => {
    try {
        await connectDB();
        const { name } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : '';
        const newMajor = new Major({ name, image });
        await newMajor.save();
        res.redirect('/dashboard/majors');
    } catch (error) {
        console.error('Error adding major:', error);
        res.redirect('/dashboard/majors');
    } finally {
        await disconnectDB();
    }
};

exports.getYears = async () => {
    try {
        await connectDB();
        return await Year.find({});
    } catch (error) {
        console.error('Error retrieving years:', error);
    } finally {
        await disconnectDB();
    }
};