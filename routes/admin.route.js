const express = require('express');
const router = express.Router();
const adminControllers = require('../controllers/admin.controllers');
const majorControllers = require('../controllers/major.controllers');
const subjectControllers = require('../controllers/subject.controller');
const documentController = require('../controllers/document.controller');
const userControllers = require('../controllers/user.controller');
const uploadImage = require('../config/image');
const uploadDocument = require('../config/document');
const { isAdmin } = require('../config/auth');

// Majors requrest
router.get('/dashboard', isAdmin, adminControllers.getDashboard);
router.get('/dashboard/majors', isAdmin, adminControllers.getMajorsPage);
router.get('/dashboard/major/update/:id', isAdmin, adminControllers.getUpdateMajorPage);
router.get('/dashboard/major/add', isAdmin, adminControllers.getAddMajorPage);
router.post('/dashboard/major/update/:id', uploadImage.single('image'), isAdmin, majorControllers.updateMajor);
router.post('/dashboard/major/add', uploadImage.single('image'), isAdmin, majorControllers.addMajor);
router.post('/dashboard/major/delete/:id', isAdmin, majorControllers.deleteMajor);

// Submajors requrest
router.get('/dashboard/major/:id/years', isAdmin, adminControllers.getSubmajorsPage);
router.get('/dashboard/major/:id/submajor/add/', isAdmin, adminControllers.getAddSubmajorPage);
router.get('/dashboard/major/:id/submajor/update/:id', isAdmin, adminControllers.getUpdateSubmajorPage);
router.post('/dashboard/major/:id/submajor/update/:id', isAdmin, majorControllers.updateSubmajor);
router.post('/dashboard/major/:id/submajor/add', isAdmin, majorControllers.addSubmajor);
router.post('/dashboard/major/:id/submajor/delete/:id', isAdmin, majorControllers.deleteSubmajor);

// Subject requests
router.get('/dashboard/major/:majorId/year/:yearId/subjects', isAdmin, adminControllers.getSubjects);
router.get('/dashboard/major/:majorId/year/:yearId/subject/add', isAdmin, adminControllers.getAddSubjectPage);
router.get('/dashboard/major/:majorId/year/:yearId/subject/update/:id', isAdmin, adminControllers.getUpdateSubjectPage);
router.post('/dashboard/major/:majorId/year/:yearId/subject/add', isAdmin, subjectControllers.addSubject);
router.post('/dashboard/major/:majorId/year/:yearId/subject/delete/:subjectId', subjectControllers.deleteSubject);
router.post('/dashboard/major/:majorId/year/:yearId/subject/update/:subjectId', subjectControllers.updateSubject);

// Documents requests
router.get('/dashboard/subject/:subjectId/documents', isAdmin, adminControllers.getDocuments);
router.get('/dashboard/subject/:subjectId/document/add', isAdmin, adminControllers.getAddDocumentPage);
router.get('/dashboard/subject/:subjectId/document/update/:id', isAdmin, adminControllers.getUpdateDocumentPage);
router.post('/dashboard/subject/:subjectId/document/add', uploadDocument, isAdmin, documentController.addDocuments);
router.post('/dashboard/subject/:subjectId/document/update/:id', uploadDocument, isAdmin, documentController.updateDocument);
router.post('/dashboard/subject/:subjectId/document/delete/:id', isAdmin, documentController.deleteDocument);

router.get('/dashboard/logout', isAdmin, userControllers.logout);
router.get('/dashboard/users', isAdmin, adminControllers.getUsersDashboard);


module.exports = router;
