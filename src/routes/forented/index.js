import express from 'express';
import userRoutes from './users/index.js';
import attendancesRoutes from './attendances/index.js';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/attendance', attendancesRoutes);

export default router;
