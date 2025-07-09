import express from 'express';
import userRoutes from './users/index.js';

const router = express.Router();

router.use('/users', userRoutes);

export default router;
