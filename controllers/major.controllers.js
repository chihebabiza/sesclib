const Major = require('../models/major.model');
const Submajor = require('../models/submajor.model');
const { connectDB, disconnectDB } = require('../config/db');

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

exports.addSubmajor = async (req, res) => {
    try {
        await connectDB();
        const { name, majorId, years } = req.body;

        console.log('Received:', { name, majorId, years });

        const selectedYears = Array.isArray(years) ? years : [years];
        const newSubmajor = new Submajor({ name, major: majorId, years: selectedYears });
        await newSubmajor.save();
        res.redirect('/dashboard/submajors');
    } catch (error) {
        console.error('Error adding submajor:', error);
        res.status(500).send('Server Error');
    } finally {
        await disconnectDB();
    }
};

exports.updateSubmajor = async (req, res) => {
    try {
        await connectDB();
        const { id } = req.params;
        const { name, majorId, years } = req.body;

        await Submajor.findByIdAndUpdate(id, { name, major: majorId, years });
        res.redirect('/dashboard/submajors');
    } catch (error) {
        console.error('Error updating submajor:', error);
        res.status(500).send('Server Error');
    } finally {
        await disconnectDB();
    }
};

exports.deleteSubmajor = async (req, res) => {
    try {
        await connectDB();
        const { id } = req.params;
        await Submajor.findByIdAndDelete(id);
        res.redirect('/dashboard/submajors');
    } catch (error) {
        console.error('Error deleting submajor:', error);
        res.status(500).send('Server Error');
    } finally {
        await disconnectDB();
    }
};