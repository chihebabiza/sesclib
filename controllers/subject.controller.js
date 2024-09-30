const Subject = require("../models/subject.model");
const { connectDB, disconnectDB } = require("../config/db");

exports.addSubject = async (req, res) => {
    try {
        await connectDB();

        const { majorId, yearId, submajorId } = req.params;
        const { name, types, semester } = req.body;

        if (!name || !types || !semester || !majorId || !yearId) {
            req.flash('error', 'All fields are required');
            return res.redirect(`/dashboard/major/${majorId}/year/${yearId}/subject/add`);
        }

        const newSubject = new Subject({
            name, types, semester, major: majorId, year: yearId, submajorId
        });

        await newSubject.save();

        res.redirect(`/dashboard/major/${majorId}/year/${yearId}/subjects`);
    } catch (error) {
        console.error('Error adding subject:', error);
        req.flash('error', 'Error adding subject. Please try again later.');
        res.redirect(`/dashboard/major/${majorId}/year/${yearId}/subjects`);
    } finally {
        await disconnectDB();
    }
};

exports.updateSubject = async (req, res) => {
    try {
        await connectDB();

        const { majorId, yearId, submajorId } = req.params;
        const { name, types, semester } = req.body;

        if (!name || !types || !semester) {
            req.flash('error', 'All fields are required');
            return res.redirect(`/dashboard/major/${majorId}/year/${yearId}/subject/update/${req.params.subjectId}`);
        }

        const updatedSubject = await Subject.findByIdAndUpdate(req.params.subjectId, {
            name, types, semester, major: majorId, year: yearId, submajor: submajorId
        }, { new: true });

        if (!updatedSubject) {
            req.flash('error', 'Subject not found');
            return res.redirect(`/dashboard/major/${majorId}/year/${yearId}/subjects`);
        }

        res.redirect(`/dashboard/major/${majorId}/year/${yearId}/subjects`);
    } catch (error) {
        console.error('Error updating subject:', error);
        req.flash('error', 'Error updating subject. Please try again later.');
        res.redirect(`/dashboard/major/${majorId}/year/${yearId}/subject/edit/${req.params.subjectId}`);
    } finally {
        await disconnectDB();
    }
};

exports.deleteSubject = async (req, res) => {
    try {
        await connectDB();

        const { subjectId, majorId, yearId } = req.params;

        const deletedSubject = await Subject.findByIdAndDelete(subjectId);

        if (!deletedSubject) {
            return res.status(404).send('Subject not found');
        }

        res.redirect(`/dashboard/major/${majorId}/year/${yearId}/subjects?success=SubjectDeleted`);
    } catch (error) {
        console.error('Error deleting subject:', error);
        res.render('user/error', { message: 'An unexpected error occurred. Please try again later.' });
    } finally {
        await disconnectDB();
    }
};