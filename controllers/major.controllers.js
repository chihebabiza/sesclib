const Major = require('../models/major.model');
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

exports.getMajorById = async (majorId) => {
    try {
        await connectDB();
        const major = await Major.findById(majorId).exec();
        return major;
    } catch (err) {
        console.error('Error fetching major by ID:', err);
    } finally {
        await disconnectDB();
    }
};

exports.deleteMajor = async (req, res) => {
    try {
        await connectDB();
        const majorId = req.params.id;
        await Major.findByIdAndDelete(majorId);
        res.redirect('/dashboard/majors');
    } catch (err) {
        console.error('Error deleting major:', err);
        res.status(500).send('Server Error');
    } finally {
        await disconnectDB();
    }
};

exports.updateMajor = async (req, res) => {
    await connectDB();
    try {
        const { id } = req.params;
        const { name } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : undefined;

        const updateData = {
            name,
            ...(image && { image })
        };

        const updatedMajor = await Major.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedMajor) {
            req.flash('error', 'Major not found');
            return res.redirect('/dashboard/majors');
        }

        res.redirect('/dashboard/majors');
    } catch (error) {
        console.error('Error updating major:', error);
        res.redirect('/dashboard/majors');
    } finally {
        await disconnectDB();
    }
};

exports.addMajor = async (req, res) => {
    await connectDB();
    try {
        const { name } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : '';

        const newMajor = new Major({
            name,
            image
        });

        await newMajor.save();
        res.redirect('/dashboard/majors');
    } catch (error) {
        console.error('Error adding major:', error);
        res.redirect('/dashboard/majors');
    } finally {
        await disconnectDB();
    }
};