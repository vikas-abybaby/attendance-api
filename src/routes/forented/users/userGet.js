import express from 'express';
import multer from 'multer';
import controllers from '../../../controllers/index.js';
import middlewares from '../../../middlewares/index.js';

const router = express.Router();
const upload = multer();

router.get(
    '/users',
    upload.none(),
    middlewares.authMiddleware,
    controllers.userControllers.userGet,
);

export default router;
