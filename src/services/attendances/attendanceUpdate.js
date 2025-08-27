
import Attendance from '../../models/attendance.js';
import Helper from '../../utils/index.js';
import Services from './activityService.js';


export const attendanceUppdate = async ({ id, lat, long, location }) => {
    const currentTime = Helper.dateHelper.getCurrentISTTime();

    const attendance = await Attendance.findOne({ where: { id } });

    if (!attendance) {
        throw new Error('Attendance record not found for check-out.');
    }

    attendance.checkOutTime = currentTime;
    attendance.checkOut = true;
    attendance.checkOutLocation = location || null;
    attendance.activityLatLong = await Services.addActivityLog(attendance.activityLatLong, { lat: lat?.toString(), long: long?.toString(), time: currentTime });
    await attendance.save();

    return attendance;
};