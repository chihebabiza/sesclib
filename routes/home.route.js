const express = require('express');
const router = express.Router();
const homeControllers = require('../controllers/home.controllers');
const userControllers = require('../controllers/user.controller');
const { isUser } = require('../config/auth');

router.get('/', homeControllers.getHome);
router.get('/resourses', isUser, homeControllers.getResourses);
router.get('/major/:id', isUser, homeControllers.getMajor);
router.get('/login', homeControllers.getLogin);
router.get('/register', homeControllers.getRegister);
router.get('/major/:majorId/documents/:type/:subjectId', isUser, homeControllers.getDocuments);
router.post('/register', userControllers.register);
router.post('/login', userControllers.login);
router.get('/logout', isUser, userControllers.logout);
router.get('/about', homeControllers.getAbout);
router.get('/contact', homeControllers.getContact);

module.exports = router;