

import services from '../../services/index.js';


export const attendanceMark = async (req, res) => {

    try {
        const userId = req.user.userId;
        const { lat, long, location } = req.body;

        let attendance = await services.attendancesServices.attendanceByUserId(userId);
        if (!attendance) {
            attendance = await services.attendancesServices.createAttendance({
                userId,
                lat,
                long,
                location,

            });

            return res.status(201).json({
                message: "Checked in successfully.",
                status_code: 201,
                data: attendance
            });
        }



        if (attendance.checkInTime && !attendance.checkOutTime) {
            attendance = await services.attendancesServices.updateAttendanceCheckout(
                {
                    userId,
                    lat,
                    long,
                    location,
                }
            );


            return res.status(200).json({
                message: "Checked out successfully.",
                status_code: 200,
                data: attendance
            });
        }

        return res.status(200).json({
            message: "You have already checked in and checked out today.",
            status_code: 200,
            data: attendance
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error during attendance check." + error,

            status_code: 500,
            data: null
        });
    }
}

