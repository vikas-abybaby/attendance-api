

import Services from '../../services/index.js';

export const attendanceToday = async (req, res) => {
    try {
        const userId = req.user.userId;



        const todayAttendance = {
            "checkInTime": null,
            "checkIn": false,
            "absent": false,
            "late": null,
            "checkOutTime": null,
            "checkOut": false,
            "month_without_late": 0,
            "month_late": 0,
            "month_absent": 0,
            "group":[]

        }


        const withoutLateattendanceMonth = await Services.attendanceServices.attendanceWithLate(userId);
        const lateAttendanceMonth = await Services.attendanceServices.attendanceWithoutLate(userId);
        todayAttendance.month_without_late = withoutLateattendanceMonth.length;
        todayAttendance.month_late = lateAttendanceMonth.length;
        const attendance = await Services.attendanceServices.attendanceGetByUserId(userId);

        todayAttendance.group = await Services.groupServices.getGroups();

        if (!attendance) {
            return res.status(200).json({
                message: "",
                status_code: 200,
                data: todayAttendance
            });
        }




        todayAttendance.checkInTime = attendance.checkInTime;
        todayAttendance.checkIn = attendance.checkIn;
        todayAttendance.absent = attendance.absent;
        todayAttendance.late = attendance.late;
        todayAttendance.checkOutTime = attendance.checkOutTime;
        todayAttendance.checkOut = attendance.checkOut;




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


