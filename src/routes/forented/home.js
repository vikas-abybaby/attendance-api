const express = require('express');
const router = express.Router();
const homeController = require('../../controllers/home');
const authMiddleware = require('../src/middlewares');

router.get('/', authMiddleware.accessValidator, homeController.getHome);
module.exports = router;