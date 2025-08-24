
import Utils from '../../utils/index.js';
import User from '../../models/user.js';
import Attendance from '../../models/attendance.js';
import Services from '../../services/index.js';

export const attendanceAll = async (req, res) => {
    try {
        const today = Utils.getTodayIST();
        const { startDate = today, endDate = today } = req.body || {};
        const user = await Services.userServices.getActiveUserById(req.user.userId);
        let dateFilter = {};
        let filter = [];

        console.log("HYY IAM VIAND");

        if (startDate && endDate) {
            dateFilter.date = {
                $gte: startDate,
                $lte: endDate
            };
        }
        console.log("HYY IAM VIAND 1");

        if (user.role === 'hr') {
            console.log("hr");

            const employeeIds = await Services.userServices.getFIndBy({ role: 'employee' })
            const employeeIdStrings = employeeIds.map(u => u._id.toString());
            filter = await Services.attendancesServices.getAttendanceWithUsers({ userIds: employeeIdStrings, dateFilter });
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
            message: 'Internal Server Error' + error,
            status_code: 500,
            data: null
        });
    }
}


