// const express = require('express');

// const multer = require('multer');
// const router = express.Router();
// const authMiddleware = require('../src/middlewares/user');

// const userController = require('../controllers/user');
// const upload = multer();


// router.get('/', authMiddleware, userController.getAllUsers);
// router.post('/login', upload.none(), userController.userLogin);
// router.post('/add', upload.none(), authMiddleware, userController.createUser);
// router.post('/edit', upload.none(), authMiddleware, userController.updateUserById);
// router.get('/profile', upload.none(), authMiddleware, userController.userProfile);
// router.get('/calebrations',upload.none(),  authMiddleware, userController.userCalebration);

// module.exports = router;


// base url
// http://192.168.0.111:27017/api/v1/



const express = require('express');
const router = express.Router();

const userController = require('../../controllers/userController');
const validate = require('../../src/middlewares/validateRequest');
const { registerSchema, loginSchema } = require('./validations');

router.post('/register', validate(registerSchema), userController.register);
router.post('/login', validate(loginSchema), userController.login);

module.exports = router;
