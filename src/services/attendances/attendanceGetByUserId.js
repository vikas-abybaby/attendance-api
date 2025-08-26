import Attendance from '../../models/attendance.js';
import Helper from '../../utils/index.js';


export const attendanceGetByUserId = async (userId,) => {
    const today = Helper.getTodayDate();
    return await Attendance.findOne({
        where: {
            userId: userId,
            date: today
        }
    });
};