import express from 'express';
import multer from 'multer';
import controllers from '../../../controllers/index.js';
import authMiddleware from '../../../middlewares/index.js';

const router = express.Router();
const upload = multer();

router.get('/users', upload.none(), authMiddleware.accessValidator, controllers.userControllers.userGet);

export default router;
