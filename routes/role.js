const express = require('express');
const multer = require('multer');
const router = express.Router();
const roleController = require('../controllers/role');
const upload = multer();

router.post('/role-add', upload.none(), roleController.createRole);
module.exports = router;
