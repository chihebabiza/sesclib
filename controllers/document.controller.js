const Document = require('../models/document.model');
const path = require('path');
const { connectDB, disconnectDB } = require('../config/db');

exports.addDocuments = async (req, res) => {
    try {
        await connectDB();
        const { type } = req.body;
        const { subjectId } = req.params;

        const documents = req.files;

        if (!type || !documents || documents.length === 0) {
            req.flash('error', 'All fields are required .');
            return res.redirect(`/dashboard/subject/${subjectId}/document/add`);
        }

        for (const file of documents) {
            const originalNameWithoutExtension = path.parse(file.originalname).name;
            const newDocument = new Document({
                name: originalNameWithoutExtension,
                type: type,
                path: `/uploads/documents/${file.filename}`,
                subject: subjectId
            });

            await newDocument.save();
        }

        res.redirect(`/dashboard/subject/${subjectId}/documents`);
    } catch (error) {
        console.error('Error adding documents:', error);
        req.flash('error', 'Error adding documents. Please try again later.');
        res.redirect(`/dashboard/subject/${subjectId}/document/add`);
    } finally {
        await disconnectDB();
    }
};

exports.updateDocument = async (req, res) => {
    try {
        await connectDB();
        const { subjectId, id } = req.params;
        console.log('req.body', req.body);
        const { name, type } = req.body;

        const existingDocument = await Document.findById(id);

        const documentPath = req.file ? `/uploads/documents/${req.file.filename}` : existingDocument.document;

        await Document.findByIdAndUpdate(id, { name, type, path: documentPath }, { new: true });

        res.redirect(`/dashboard/subject/${subjectId}/documents?success=DocumentUpdated`);
    } catch (error) {
        console.error('Error updating document:', error);
        res.render('user/error', { message: 'An unexpected error occurred. Please try again later.' });
    } finally {
        await disconnectDB();
    }
};

exports.deleteDocument = async (req, res) => {
    try {
        await connectDB();
        const { id } = req.params;

        await Document.findByIdAndDelete(id);

        res.redirect(`/dashboard/subject/${req.params.subjectId}/documents?success=DocumentDeleted`);
    } catch (error) {
        console.error('Error deleting document:', error);
        res.render('user/error', { message: 'An unexpected error occurred. Please try again later.' });
    } finally {
        await disconnectDB();
    }
};