const express = require('express');
const router = express.Router();
const attendanceController = require('../../controllers/attendance');
import { accessValidator } from '../../middlewares/index.js';
const multer = require('multer');
const upload = multer();


router.post('/', upload.none(), accessValidator, attendanceController.myMarkAttendance);
router.post('/all', upload.none(), accessValidator, attendanceController.allMarkAttendance);
router.post('/mark', upload.none(), accessValidator, attendanceController.checkMarkAttendance);
router.post('/activity', upload.none(), accessValidator, attendanceController.activityRecords);
router.post('/count', upload.none(),accessValidator, attendanceController.allAttendanceCount);
module.exports = router;