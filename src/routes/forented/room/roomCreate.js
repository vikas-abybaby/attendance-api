import express from 'express';
import controllers from '../../../controllers/index.js';
import middlewares from '../../../middlewares/index.js';
import validators from '../../../validators/index.js';

const router = express.Router();

router.post(
    '/create',
    middlewares.photoUpload("room").single("avatar_url"),
    middlewares.allValidator(validators.roomValidators.roomCreate),
    middlewares.authMiddleware,
    controllers.roomControllers.roomCreate,
);

export default router;
