const Attendance = require("../models/attendance");
const User = require("../models/user");
const Leave = require("../models/leave");
const TodayAttendance = require("../utils/dateHelper")




const activityRecords = async (req, res) => {
    try {
        const userId = req.user.userId;
        const today = TodayAttendance.getTodayIST();
        const time = TodayAttendance.getCurrentISTTime();
        const { lat = null, long = null } = req.body;

        if (!lat || !long) {
            return res.status(400).json({
                message: 'Latitude and Longitude are required fields',
                status_code: 400,
                data: null
            });
        }
        const attendance = await Attendance.findOne({ userId, date: today });
        if (!attendance) {
            return res.status(404).json({
                message: 'Attendance not found for today',
                status_code: 404,
            });
        }
        attendance.activityLatLong = attendance.activityLatLong || [];
        attendance.activityLatLong.push({
            lat: lat.toString(),
            long: long.toString(),
            time: time,
        });
        await attendance.save();
        return res.status(200).json({
            message: 'Location updated successfully',
            status_code: 200,
            data: attendance.activityLatLong,
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error during attendance check.",
            status_code: 500,
            data: null
        });
    }
}


const allMarkAttendance = async (req, res) => {
    try {
        const today = TodayAttendance.getTodayIST();
        const { startDate = today, endDate = today } = req.body || {};
        const user = await User.findById(req.user.userId).select('-password');
        let dateFilter = {};
        let filter = [];


        if (startDate && endDate) {
            dateFilter.date = {
                $gte: startDate,
                $lte: endDate
            };
        }

        if (user.role === 'hr') {
            const employeeIds = await User.find({ role: 'employee' }).select('_id');

            const employeeIdStrings = employeeIds.map(u => u._id.toString());
            filter = await Attendance.find({
                userId: { $in: employeeIdStrings },
                ...dateFilter
            }).populate('userId', '-password');
        } else if (user.role === 'manager') {
            const employeeIds = await User.find({
                role: { $in: ['employee', 'hr'] }
            }).select('_id');
            const employeeIdStrings = employeeIds.map(u => u._id.toString());
            filter = await Attendance.find({
                userId: { $in: employeeIdStrings },
                ...dateFilter
            }).populate('userId', '-password');
        } else if (user.role === 'admin') {
            const employeeIds = await User.find({
                role: { $in: ['manager', 'employee', 'hr'] }
            }).select('_id');
            const employeeIdStrings = employeeIds.map(u => u._id.toString());
            filter = await Attendance.find({
                userId: { $in: employeeIdStrings },
                ...dateFilter
            }).populate('userId', '-password');
        } else {
            filter = [];
        }
        const result = filter.map(att => ({
            ...att.userId?.toObject(),
            attendance: {
                _id: att._id,
                date: att.date,
                checkInTime: att.checkInTime,
                checkOutTime: att.checkOutTime,
                checkInLocation: att.checkInLocation,
                checkOutLocation: att.checkOutLocation,
                createdAt: att.createdAt,
                updatedAt: att.updatedAt,
            }
        }));


        res.status(200).json({
            message: 'Attendance fetched successfully',
            status_code: 200,
            data: result
        });

    } catch (error) {

        res.status(500).json({
            message: 'Internal Server Error',
            status_code: 500,
            data: null
        });
    }
};

const myMarkAttendance = async (req, res) => {
    try {
        const today = TodayAttendance.getTodayIST();
        const { startDate = today, endDate = today } = req.body || {};
        let dateFilter = {};
        if (startDate && endDate) {
            dateFilter.date = {
                $gte: startDate,
                $lte: endDate
            };
        }

        const filter = await Attendance.find({
            userId: { $in: req.user.userId },
            ...dateFilter
        }).populate('userId', '-password');
        const result = filter.map(att => ({
            ...att.userId?.toObject(),
            attendance: {
                _id: att._id,
                date: att.date,
                checkInTime: att.checkInTime,
                checkOutTime: att.checkOutTime,
                checkInLocation: att.checkInLocation,
                checkOutLocation: att.checkOutLocation,
                createdAt: att.createdAt,
                updatedAt: att.updatedAt,
            }
        }));


        res.status(200).json({
            message: 'Attendance fetched successfully',
            status_code: 200,
            data: result
        });


    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error',
            status_code: 500,
            data: null
        });
    }
}
const allAttendanceCount = async (req, res) => {

    try {
        const today = TodayAttendance.getTodayIST();
        const userId = req.user.userId;
        const { startDate = today, endDate = today } = req.body || {};
        let dateFilter = {};
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ status: false, message: "User not found" });
        }

        if (startDate && endDate) {
            dateFilter.date = {
                $gte: startDate,
                $lte: endDate
            };
        }

        const attendanceCount = await Attendance.countDocuments({
            userId: req.user.userId,
            ...dateFilter,
        });
        const attendanceLateCount = await Attendance.countDocuments({
            userId: userId,
            ...dateFilter,
            late: 1
        });
        const leave = await Leave.countDocuments({
            userId: userId,
            ...dateFilter
        });
        return res.status(200).json({
            status: true,
            message: "Attendance count fetched successfully",
            data: [
                {
                    "count": attendanceCount,
                    "name": "Attendance"
                },
                {
                    "count": attendanceLateCount,
                    "name": "Late "
                },
                {
                    "count": leave,
                    "name": "Leave "
                }
            ],
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Internal Server Error",
        });
    }

}

module.exports = {
    myMarkAttendance,
    activityRecords,
    allMarkAttendance,
    allAttendanceCount,
}