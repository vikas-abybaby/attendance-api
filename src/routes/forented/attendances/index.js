import express from 'express';
import attendanceAddRouter from './attendanceAdd.js';


const router = express.Router();

router.use(attendanceAddRouter);


export default router;