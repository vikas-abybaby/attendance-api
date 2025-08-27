import express from 'express';
import controllers from '../../../controllers/index.js';
import middlewares from '../../../middlewares/index.js';
const router = express.Router();

router.post(
    '/',
    middlewares.authMiddleware,
    controllers.groupControllers.groupGet,
);

export default router;