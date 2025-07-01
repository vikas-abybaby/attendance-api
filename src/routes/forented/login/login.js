const userController = require('../../../controllers/user')
const express = require('express');
const multer = require('multer');
const router = express.Router();
const upload = multer();

router.post('/users-login',  upload.none() ,userController.userLogin);

module.exports = router;