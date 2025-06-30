const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendance');
const authMiddleware = require('../middlewares/user');
const multer = require('multer');
const upload = multer();


router.post('/', upload.none(), authMiddleware, attendanceController.myMarkAttendance);
router.post('/all', upload.none(), authMiddleware, attendanceController.allMarkAttendance);
router.post('/mark', upload.none(), authMiddleware, attendanceController.checkMarkAttendance);
router.post('/activity', upload.none(), authMiddleware, attendanceController.activityRecords);
router.post('/count', upload.none(), authMiddleware, attendanceController.allAttendanceCount);
module.exports = router;