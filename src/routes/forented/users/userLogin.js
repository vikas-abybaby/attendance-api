import express from 'express';
import multer from 'multer';
import controllers from '../../../controllers/index.js';
import loginSchema from '../../../validators/index.js';
import middlewares from '../../../middlewares/index.js';
const router = express.Router();
const upload = multer();

router.post(
    '/login',
    upload.none(),
    controllers.userControllers.userLogin,
);

export default router;
