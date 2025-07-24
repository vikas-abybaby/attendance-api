
import Helper from '../../utils/index.js';
import Services from '../../services/index.js'

export const attendanceAdd = async (req, res) => {
    const { currentDay, currentMonth, currentYear } = Helper.getISTDateParts();
    const userId = req.user.userId;
    const currentTime = Helper.getCurrentISTTime();
    const { location, lat, long } = req.body;

    try {
        const attendance = await Services.todayAttendance(userId, currentDay);
        if (!attendance) {
            attendance = await Attendance.create({
                userId,
                date: today,
                checkInTime: currentTime || null,
                checkInLocation: location || null,
                activityLatLong: [
                    {
                        lat: lat.toString(),
                        long: long.toString(),
                        time: currentTime,
                    }
                ]
            });

            return res.status(201).json({
                message: "Checked in successfully.",
                status_code: 201,
                data: attendance
            });
        }


        if (attendance.checkInTime && !attendance.checkOutTime) {
            attendance.checkOutTime = currentTime || null;
            attendance.checkOutLocation = location || null;
            attendance.activityLatLong.push({
                lat: lat.toString(),
                long: long.toString(),
                time: currentTime,
            });
            await attendance.save();

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

    } catch (err) {
        return res.status(500).json({
            message: "Server error during attendance check.",
            status_code: 500,
            data: null
        });
    }
}
