const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home');
const authMiddleware = require('../middlewares/user');

router.get('/', authMiddleware, homeController.getHome);
module.exports = router;