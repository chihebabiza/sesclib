const express = require('express');
const router = express.Router();
const adminControllers = require('../controllers/admin.controllers');
const majorControllers = require('../controllers/major.controllers');
const subjectControllers = require('../controllers/subject.controller');
const upload = require('../config/upload');

// Majors Get requrest
router.get('/dashboard', adminControllers.getDashboard);
router.get('/dashboard/majors', adminControllers.getMajorsPage);
router.get('/dashboard/major/update/:id', adminControllers.getUpdateMajorPage);
router.get('/dashboard/major/add', adminControllers.getAddMajorPage);

// Submajors Get requrest
router.get('/dashboard/major/:id/years', adminControllers.getSubmajorsPage);
router.get('/dashboard/major/:id/submajor/add/', adminControllers.getAddSubmajorPage);
router.get('/dashboard/major/:id/submajor/update/:id', adminControllers.getUpdateSubmajorPage);

// Subject Get requests
router.get('/dashboard/major/:majorId/year/:yearId/subjects', adminControllers.getSubjects);
router.get('/dashboard/major/:majorId/year/:yearId/subject/add', adminControllers.getAddSubjectPage);
router.get('/dashboard/major/:majorId/year/:yearId/subject/update/:id', adminControllers.getUpdateSubjectPage);

// Subject Post requests
router.post('/dashboard/major/:majorId/year/:yearId/subject/add', subjectControllers.addSubject);
router.post('/dashboard/major/:majorId/year/:yearId/subject/delete/:subjectId', subjectControllers.deleteSubject);
router.post('/dashboard/major/:majorId/year/:yearId/subject/update/:subjectId', subjectControllers.updateSubject);

// Majors Post requrest
router.post('/dashboard/major/update/:id', upload.single('image'), majorControllers.updateMajor);
router.post('/dashboard/major/add', upload.single('image'), majorControllers.addMajor);
router.post('/dashboard/major/delete/:id', majorControllers.deleteMajor);

// Submajors Post requests
router.post('/dashboard/major/:id/submajor/update/:id', majorControllers.updateSubmajor);
router.post('/dashboard/major/:id/submajor/add', majorControllers.addSubmajor);
router.post('/dashboard/major/:id/submajor/delete/:id', majorControllers.deleteSubmajor);

// Documents Get requests
router.get('/dashboard/subject/:subjectId/documents',adminControllers.getDocuments);


module.exports = router;
