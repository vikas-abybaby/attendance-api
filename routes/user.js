const express = require('express');

const multer = require('multer');
const router = express.Router();
const authMiddleware = require('../middlewares/user');

const userController = require('../controllers/user');
const upload = multer();

// POST /api/users
router.get('/', userController.getAllUsers);  // GET all users
router.post('/add', upload.none(), userController.createUser);
router.post('/edit', upload.none(), userController.updateUserById);  // GET all users
router.post('/login', upload.none(), userController.userLogin);
router.get('/profile', upload.none(), authMiddleware, userController.userProfile,)
module.exports = router;


//base url
// http://172.20.10.4:8001/api/v1/