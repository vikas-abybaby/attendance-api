const userController = require('../../../controllers/user')
const authMiddleware = require('../../../middlewares/user');
const express = require('express');
const multer = require('multer');
const router = express.Router();

const upload = multer();


router.get('/users', upload.none(), authMiddleware,userController.getAllUsers);

module.exports = router;