const express = require('express');
const router = express.Router();
const homeControllers = require('../controllers/home.controllers');

router.get('/', homeControllers.getHome);

module.exports = router;