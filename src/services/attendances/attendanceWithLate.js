import Attendance from '../../models/attendance.js';
import Helper from '../../utils/index.js';
import { Op } from "sequelize";

export const attendanceWithLate = async (userId) => {
    const endOfMonth = Helper.dateHelper.getTodayDate();
    const modifyDate = endOfMonth.split("-")
    modifyDate[modifyDate.length - 1] = '01';    //  = `${endOfMonth.getFullYear()}-${String(endOfMonth.getMonth() + 1).padStart(2, "0")}-01`;
    const startOfMonth = modifyDate.join("-")
    const attendance = await Attendance.findAll({
        where: {
            user_id: userId,
            checkIn: true,
            late: true,
            date: {
                [Op.between]: [startOfMonth, endOfMonth]
            }
        }
    });
    return attendance;
}