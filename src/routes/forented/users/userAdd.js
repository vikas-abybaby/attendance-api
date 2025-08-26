import express from 'express';
import controllers from '../../../controllers/index.js';
import middlewares from '../../../middlewares/index.js';
import validators from '../../../validators/index.js';

const router = express.Router();


router.post(
    '/add',
    middlewares.photoUpload("profile").single("profile_url"),
    middlewares.allValidator(validators.userValidators.userCreate),
    controllers.userControllers.userAdd,
);

export default router;
