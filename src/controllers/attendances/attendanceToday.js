

import services from '../../services/index.js';

export const attendanceToday = async (req, res) => {
    try {
        const userId = req.user.userId;



        const todayAttendance = {
            "checkInTime": null,
            "checkIn": false,
            "late": null,
            "checkOutTime": null,
            "checkOut": false,
            "month_present": 0,
            "month_late": 0,
            "month_absent": 0

        }
        const attendance = await services.attendancesServices.attendanceByUserId(userId);



        if (!attendance) {
            return res.status(200).json({
                message: "No attendance record found for today.",
                status_code: 200,
                data: todayAttendance
            });
        }
        const attendanceMonth = await services.attendancesServices.getAttendanceWithMonth(userId);
        const lateAttendanceMonth = await services.attendancesServices.getLateAttendanceWithMonth(userId);



        todayAttendance.checkInTime = attendance.checkInTime;
        todayAttendance.checkIn = attendance.checkIn;
        todayAttendance.late = attendance.late;
        todayAttendance.checkOutTime = attendance.checkOutTime;
        todayAttendance.checkOut = attendance.checkOut;
        todayAttendance.month_present = attendanceMonth.length;
        todayAttendance.month_late = lateAttendanceMonth.length;



        return res.status(200).json({
            message: "",
            status_code: 200,
            data: todayAttendance
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


