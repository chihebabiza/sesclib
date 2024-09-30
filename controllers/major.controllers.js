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
        res.render('user/error', { message: 'An unexpected error occurred. Please try again later.' });
    } finally {
        await disconnectDB();
    }
};

exports.addMajor = async (req, res) => {
    try {
        await connectDB();
        const { name } = req.body;
        const image = req.file ? `/uploads/images/${req.file.filename}` : '';
        const newMajor = new Major({ name, image });
        await newMajor.save();
        res.redirect('/dashboard/majors');
    } catch (error) {
        console.error('Error adding major:', error);
        res.render('user/error', { message: 'An unexpected error occurred. Please try again later.' });
    } finally {
        await disconnectDB();
    }
};

exports.addSubmajor = async (req, res) => {
    const majorId = req.params.id;
    const { name, years } = req.body;

    if (!name || !years) {
        req.flash('error', 'All fields are required');
        return res.redirect(`/dashboard/major/${majorId}/submajor/add`);
    }

    try {
        await connectDB();

        const newSubmajor = new Submajor({ name, major: majorId, years });
        await newSubmajor.save();
        res.redirect(`/dashboard/major/${majorId}/years`);
    } catch (error) {
        console.error('Error adding submajor:', error);
        req.flash('error', 'Error adding submajor. Please try again later.');
        res.redirect(`/dashboard/major/${majorId}/submajor/add`);
    } finally {
        await disconnectDB();
    }
};

exports.updateSubmajor = async (req, res) => {
    const submajorId = req.params.id;
    const { name, years, major } = req.body;

    if (!name || !years || !major) {
        req.flash('error', 'All fields are required');
        return res.redirect(`/dashboard/major/${major}/submajor/update/${submajorId}`);
    }

    try {
        await connectDB();

        await Submajor.findByIdAndUpdate(submajorId, { name, major, years }, { new: true });

        res.redirect(`/dashboard/major/${major}/years`);
    } catch (error) {
        console.error('Error updating submajor:', error);

        req.flash('error', 'Error updating submajor. Please try again later.');
        res.redirect(`/dashboard/major/${major}/submajor/edit/${submajorId}`);
    } finally {
        await disconnectDB();
    }
};

exports.deleteSubmajor = async (req, res) => {
    const { id } = req.params;

    try {
        await connectDB();

        const submajor = await Submajor.findById(id);

        if (!submajor) {
            return res.status(404).send('Submajor not found');
        }

        const { major } = submajor;

        await Submajor.findByIdAndDelete(id);

        res.redirect(`/dashboard/major/${major}/years`);
    } catch (error) {
        console.error('Error deleting submajor:', error);
        res.render('user/error', { message: 'An unexpected error occurred. Please try again later.' });
    } finally {
        await disconnectDB();
    }
};