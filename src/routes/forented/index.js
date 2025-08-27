import express from 'express';
import userRoutes from './users/index.js';
import attendancesRoutes from './attendances/index.js';
import roomRoutes from './group/index.js';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/attendance', attendancesRoutes);
router.use('/rooms', roomRoutes);

export default router;
