import Attendance from '../../models/attendance.js';
import Helper from '../../utils/index.js';

export const attendanceCreate = async ({ userId, lat, long, location, absent = 0 }) => {
    const currentTime = Helper.getCurrentISTTime();
    const formattedDate = Helper.getTodayDate();
    console.log("createAttendance" + userId, lat, long, location, absent);
    return await Attendance.create({
        userId,
        date: formattedDate,
        checkInTime: absent == 0 ? (currentTime || null) : null,
        checkIn: absent == 0 ? true : false,
        checkInLocation: absent == 0 ? (location || null) : null,
        absent: absent == 1 ? true : false,
        absentTime: absent == 1 ? (currentTime || null) : null,
        absentLocation: absent == 1 ? (location || null) : null,
        activityLatLong: [
            {
                lat: lat?.toString(),
                long: long?.toString(),
                time: currentTime,
            },
        ],
    });
};