const express = require('express');
const router = express.Router();
const homeControllers = require('../controllers/home.controllers');

router.get('/', homeControllers.getHome);
router.get('/resourses',homeControllers.getResourses);
router.get('/major/:id', homeControllers.getMajor);
router.get('/login', homeControllers.getLogin);
router.get('/register', homeControllers.getRegister);
router.get('/major/:majorId/documents/:type/:subjectId', homeControllers.getDocuments);


module.exports = router;