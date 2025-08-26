import express from 'express';
import controllers from '../../../controllers/index.js';
import middlewares from '../../../middlewares/index.js';
const router = express.Router();

router.post(
    '/',
    middlewares.authMiddleware,
    controllers.roomControllers.roomGet,
);

export default router;