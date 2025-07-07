import express from 'express';
import multer from 'multer';
import controllers  from '../../../controllers/index.js';

const router = express.Router();
const upload = multer();

router.post('/add', upload.none(), controllers.userControllers.userAdd);

export default router;
