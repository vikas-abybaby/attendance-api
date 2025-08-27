

import express from 'express';
import groupCreateRouter from './groupCreate.js';
import groupGetRouter from './groupGet.js';
const router = express.Router();

router.use(groupCreateRouter);
router.use(groupGetRouter);

export default router;