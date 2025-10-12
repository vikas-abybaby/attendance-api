import Attendance from '../../models/attendance.js';
import { dateHelper } from '../../utils/index.js';


export const attendanceGetByUserId = async (userId,) => {
    const today = dateHelper.getTodayDate();
    return await Attendance.findOne({
        where: {
            user_id: userId,
            date: today
        }
    });
};