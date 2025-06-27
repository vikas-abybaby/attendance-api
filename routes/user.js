const express = require('express');

const multer = require('multer');
const router = express.Router();
const authMiddleware = require('../middlewares/user');

const userController = require('../controllers/user');
const upload = multer();


router.get('/', authMiddleware, userController.getAllUsers);
router.post('/login', upload.none(), userController.userLogin);
router.post('/add', upload.none(), userController.createUser);
router.post('/edit', upload.none(), authMiddleware, userController.updateUserById);
router.get('/profile', upload.none(), authMiddleware, userController.userProfile);
router.get('/birthdays', upload.none(), authMiddleware, userController.userBirthday);
router.get('/anniversarys', upload.none(), authMiddleware, userController.userAnniversary);
module.exports = router;


// base url
// http://192.168.0.111:27017/api/v1/