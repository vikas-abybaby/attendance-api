import express from 'express';
import multer from 'multer';
import controllers from '../../../controllers/index.js';
import authMiddleware from '../../../middlewares/index.js';

const router = express.Router();
const upload = multer();

router.get(
    '/profile',
    upload.none(),
    authMiddleware.authMiddleware,
    controllers.userControllers.userProfile,
);

export default router;
