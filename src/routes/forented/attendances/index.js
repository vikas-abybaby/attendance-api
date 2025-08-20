import express from 'express';
import attendanceAddRouter from './attendanceAdd.js';
import attendanceAllRouter from './attendanceAll.js';


const router = express.Router();

router.use(attendanceAddRouter);
router.use(attendanceAllRouter);


export default router;