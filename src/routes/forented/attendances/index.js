import express from 'express';
import attendanceAddRouter from './attendanceAdd.js';
import attendanceAllRouter from './attendanceAll.js';
import attendanceTodayRouter from './attendanceToday.js';


const router = express.Router();

router.use(attendanceAddRouter);
router.use(attendanceAllRouter);
router.use(attendanceTodayRouter);


export default router;