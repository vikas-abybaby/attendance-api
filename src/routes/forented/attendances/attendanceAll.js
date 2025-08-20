import express from 'express';
import multer from 'multer';
import controllers from '../../../controllers/index.js';
import middlewares from '../../../middlewares/index.js';

const router = express.Router();
const upload = multer();

router.post(
    '/all',
    upload.none(),
    middlewares.authMiddleware,
    controllers.attendanceControllers.attendanceAll,
);

export default router;