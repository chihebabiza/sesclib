const Subject = require("../models/subject.model");
const { connectDB, disconnectDB } = require("../config/db");
const Submajor = require("../models/submajor.model");

exports.addSubject = async (req, res) => {
    try {
        await connectDB();

        const { name, semester, yearId, submajorId, majorId, types } = req.body;

        const submajors = await Submajor.find({ major: majorId, years: yearId });
        if (submajors.length === 0 && submajorId) {
            return res.status(400).redirect('/dashboard/subject/add?error=SubmajorError');
        }

        const newSubject = new Subject({
            name,
            semester,
            year: yearId,
            submajor: submajorId,
            major: majorId,
            types: Array.isArray(types) ? types : [types]
        });

        await newSubject.save();
        res.redirect('/dashboard/majors');
    } catch (error) {
        console.error('Error adding subject:', error);
        res.redirect('/dashboard/subject/add?error=ServerError');
    } finally {
        await disconnectDB();
    }
};


exports.updateSubject = async (req, res) => {
    try {
        await connectDB();
        const { name, semester, year, submajor } = req.body;
        await Subject.findByIdAndUpdate(req.params.id, { name, semester, year, submajor });
        res.redirect('/dashboard/subjects');
    } catch (error) {
        console.error('Error updating subject:', error);
        res.status(500).send('Server Error');
    } finally {
        await disconnectDB();
    }
};

exports.deleteSubject = async (req, res) => {
    try {
        await connectDB();
        await Subject.findByIdAndDelete(req.params.id);
        res.redirect('/dashboard/subjects');
    } catch (error) {
        console.error('Error deleting subject:', error);
        res.status(500).send('Server Error');
    } finally {
        await disconnectDB();
    }
};