
import Attendance from '../../models/attendance.js';



const todayAttendance = async (userId, todayDate) => {
    return await Attendance.findOne({ userId, date: todayDate });
};

export default {
    todayAttendance
};