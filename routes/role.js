const express = require('express');
const multer = require('multer');
const router = express.Router();
const roleController = require('../controllers/role');
const upload = multer();
const authMiddleware = require('../middlewares/user');

router.post('/',authMiddleware, roleController.getRole);
module.exports = router;
