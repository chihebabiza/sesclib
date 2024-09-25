const Subject = require("../models/subject.model");
const { connectDB, disconnectDB } = require("../config/db");

exports.addSubject = async (req, res) => {
    try {
        await connectDB();

        const { majorId, yearId, submajorId } = req.params;
        const { name, types, semester } = req.body;

        if (!name || !types || !semester || !majorId || !yearId) {
            return res.status(400).send('All fields are required');
        }

        const newSubject = new Subject({
            name,
            types,
            semester,
            major: majorId,
            year: yearId,
            submajorId
        });

        await newSubject.save();

        res.redirect(`/dashboard/major/${majorId}/year/${yearId}/subjects?success=SubjectAdded`);
    } catch (error) {
        console.error('Error adding subject:', error);
        res.redirect(`/dashboard/major/${req.params.majorId}/year/${req.params.yearId}/subject/add?error=AddSubjectError`);
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
            return res.status(400).send('All fields are required');
        }

        const updatedSubject = await Subject.findByIdAndUpdate(req.params.subjectId, {
            name,
            types,
            semester,
            majorId,
            yearId,
            submajorId
        }, { new: true }); 

        if (!updatedSubject) {
            return res.status(404).send('Subject not found');
        }

        res.redirect(`/dashboard/major/${majorId}/year/${yearId}/subjects?success=SubjectUpdated`);
    } catch (error) {
        console.error('Error updating subject:', error);
        res.redirect(`/dashboard/major/${majorId}/year/${yearId}/subject/edit/${req.params.subjectId}?error=UpdateSubjectError`);
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
        res.redirect(`/dashboard/major/${req.params.majorId}/year/${req.params.yearId}/subject?error=DeleteSubjectError`);
    } finally {
        await disconnectDB();
    }
};