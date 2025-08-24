import express from 'express';
import controllers from '../../../controllers/index.js';
import middlewares from '../../../middlewares/index.js';

const router = express.Router();

router.get(
    '/today',
    middlewares.authMiddleware,
    controllers.attendanceControllers.attendanceToday,
);

export default router;