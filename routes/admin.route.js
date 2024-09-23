const express = require('express');
const router = express.Router();
const adminControllers = require('../controllers/admin.controllers');
const majorControllers = require('../controllers/major.controllers');
const subjectControllers = require('../controllers/subject.controller');
const upload = require('../config/upload');

// Majors Get requrest
router.get('/dashboard/majors', adminControllers.getMajorsPage);
router.get('/dashboard/major/update/:id', adminControllers.getUpdateMajorPage);
router.get('/dashboard/major/add', adminControllers.getAddMajorPage);

// Submajors Get requrest
router.get('/dashboard/submajors', adminControllers.getSubmajorsPage);
router.get('/dashboard/submajor/add/', adminControllers.getAddSubmajorPage);
router.get('/dashboard/submajor/update/:id', adminControllers.getUpdateSubmajorPage);

// Subject Get requests
router.get('/dashboard/subject/add', adminControllers.getAddSubjectPage);
router.get('/dashboard/subject/update:id', adminControllers.getUpdateSubmajorPage);

// Subject Post requests
router.post('/dashboard/subject/update/:id', subjectControllers.updateSubject);
router.post('/dashboard/subject/remove/:id', subjectControllers.deleteSubject);
router.post('/dashboard/subject/add', subjectControllers.addSubject);

// Majors Post requrest
router.post('/dashboard/major/update/:id', upload.single('image'), majorControllers.updateMajor);
router.post('/dashboard/major/add', upload.single('image'), majorControllers.addMajor);
router.post('/dashboard/major/delete/:id', majorControllers.deleteMajor);

// Submajors Post requests
router.post('/dashboard/submajor/update/:id', majorControllers.updateSubmajor);
router.post('/dashboard/submajor/add', majorControllers.addSubmajor);
router.post('/dashboard/submajor/delete/:id', majorControllers.deleteSubmajor);

module.exports = router;
