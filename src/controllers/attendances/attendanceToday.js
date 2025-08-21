

import services from '../../services/index.js';

export const attendanceToday = async (req, res) => {
    try {
        const userId = req.user.userId;

        const attendance = await services.attendancesServices.attendanceByUserId(userId);

        if (!attendance) {
            return res.status(404).json({
                message: "No attendance record found for today.",
                status_code: 404,
                data: null,
            });
        }
        const todayAttendance = {


            "checkInTime": attendance.checkInTime,
            "checkIn": attendance.checkIn,
            "late": attendance.late,
            "checkOutTime": attendance.checkOutTime,
            "checkOut": attendance.checkOut,

        }
        return res.status(200).json({
            message: "",
            status_code: 200,
            data: todayAttendance,
        });

    } catch (error) {
        console.error("❌ Error fetching attendance:", error);

        return res.status(500).json({
            message: "Server error during attendance check.",
            status_code: 500,
            error: error.message,
            data: null,
        });
    }
};


