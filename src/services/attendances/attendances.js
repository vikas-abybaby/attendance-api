import Attendance from '../../models/attendance.js';
import Helper from '../../utils/index.js'; // Assuming you have getISTDateParts() in here

const attendanceByUserId = async (userId,) => {
    const { currentDay, currentMonth, currentYear } = Helper.getISTDateParts();
    const today = new Date(currentYear, currentMonth - 1, currentDay);
    return await Attendance.findOne({
        userId,
        date: today,
    });
};

const createAttendance = async ({ userId, lat, long, location }) => {
    const currentTime = Helper.getCurrentISTTime();
    const formattedDate = Helper.getTodayDate();
    return await Attendance.create({
        userId,
        date: formattedDate,
        checkInTime: currentTime || null,
        checkInLocation: location || null,
        activityLatLong: [
            {
                lat: lat?.toString(),
                long: long?.toString(),
                time: currentTime,
            },
        ],
    });
};


const updateAttendanceCheckout = async ({ userId, lat, long, location }) => {

    const { currentDay, currentMonth, currentYear } = Helper.getISTDateParts();
    const currentTime = Helper.getCurrentISTTime();
    const today = new Date(currentYear, currentMonth - 1, currentDay);

    const attendance = await Attendance.findOne({ userId, date: today });

    if (!attendance) {
        throw new Error('Attendance record not found for check-out.');
    }

    attendance.checkOutTime = currentTime || null;
    attendance.checkOutLocation = location || null;

    attendance.activityLatLong.push({
        lat: lat?.toString(),
        long: long?.toString(),
        time: currentTime,
    });

    await attendance.save();
    return attendance;
};


const getAttendancesByUserIdsAndDate = async (userIds, dateFilter) => {
    return await Attendance.find({
        userId: { $in: userIds },
        ...dateFilter,
    }).populate('userId', '-password');
};


export default {
    attendanceByUserId,
    createAttendance,
    updateAttendanceCheckout,
    getAttendancesByUserIdsAndDate,
};