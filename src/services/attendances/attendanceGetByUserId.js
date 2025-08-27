import Attendance from '../../models/attendance.js';
import Helper from '../../utils/index.js';


export const attendanceGetByUserId = async (userId,) => {
    const today = Helper.dateHelper.getTodayDate();
    return await Attendance.findOne({
        where: {
            user_id: userId,
            date: today
        }
    });
};