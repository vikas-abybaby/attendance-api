import express from 'express';
import multer from 'multer';
import controllers from '../../../controllers/index.js';
import middlewares from '../../../middlewares/index.js';
import validators from '../../../validators/index.js';

const router = express.Router();
const upload = multer();

router.post(
    '/add',
    upload.none(),
    middlewares.allValidator(validators.userValidators.userCreate),
    controllers.userControllers.userAdd,
);

export default router;
