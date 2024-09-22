const express = require('express');
const router = express.Router();
const upload = require('../config/upload');
const adminControllers = require('../controllers/admin.controllers');
const majorControllers = require('../controllers/major.controllers');

// Get requrest
router.get('/dashboard/majors', adminControllers.getMajorsDashboard);
router.get('/dashboard/update-major/:id', adminControllers.getUpdateMajor);
router.get('/dashboard/add-major', adminControllers.getAddMajor);
// Post requrest
router.post('/dashboard/update-major/:id', upload.single('image'), majorControllers.updateMajor);
router.post('/dashboard/add-major', upload.single('image'), majorControllers.addMajor);
router.post('/dashboard/delete-major/:id', majorControllers.deleteMajor);

module.exports = router;
