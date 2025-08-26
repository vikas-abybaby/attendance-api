

import express from 'express';
import roomCreateRouter from './roomCreate.js';
import roomGetRouter from './roomGet.js';
const router = express.Router();

router.use(roomCreateRouter);
router.use(roomGetRouter);

export default router;