import Attendance from '../../models/attendance.js';
import Helper from '../../utils/index.js';
import Services from './activityService.js';
import { Op } from "sequelize";

const attendanceByUserId = async (userId,) => {
    const today = Helper.getTodayDate();
    return await Attendance.findOne({
        where: {
            userId: userId,
            date: today
        }
    });


};

const createAttendance = async ({ userId, lat, long, location }) => {
    const currentTime = Helper.getCurrentISTTime();
    const formattedDate = Helper.getTodayDate();
    return await Attendance.create({
        userId,
        date: formattedDate,
        checkInTime: currentTime || null,
        checkIn: true,
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


const updateAttendanceCheckout = async ({ id, lat, long, location }) => {
    const currentTime = Helper.getCurrentISTTime();

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


const getAttendancesByUserIdsAndDate = async (userIds, dateFilter) => {
    return await Attendance.find({
        userId: { $in: userIds },
        ...dateFilter,
    }).populate('userId', '-password');
};
const getAttendanceWithUsers = async ({ userIds = [], dateFilter = {} }) => {
    const query = {
        ...(userIds.length ? { userId: { $in: userIds } } : {}),
        ...dateFilter,
    };

    return await Attendance.find(query)
        .populate('userId', '-password')
        .lean();
};

const getAttendanceWithMonth = async (userId) => {
    const endOfMonth = Helper.getTodayDate();
    const modifyDate = endOfMonth.split("-")
    modifyDate[modifyDate.length - 1] = '01';    //  = `${endOfMonth.getFullYear()}-${String(endOfMonth.getMonth() + 1).padStart(2, "0")}-01`;
    const startOfMonth = modifyDate.join("-")

    const attendance = await Attendance.findAll({
        where: {
            userId: userId,
            checkIn: true,
            date: {
                [Op.between]: [startOfMonth, endOfMonth]
            }
        }
    });
    


    return attendance;
}

const getLateAttendanceWithMonth = async (userId) => {
    const endOfMonth = Helper.getTodayDate();
    const modifyDate = endOfMonth.split("-")
    modifyDate[modifyDate.length - 1] = '01';    //  = `${endOfMonth.getFullYear()}-${String(endOfMonth.getMonth() + 1).padStart(2, "0")}-01`;
    const startOfMonth = modifyDate.join("-")


    const attendance = await Attendance.findAll({
        where: {
            userId: userId,
            checkIn: true,
            late: true,
            date: {
                [Op.between]: [startOfMonth, endOfMonth]
            }
        }
    });


    return attendance;
}

export default {
    attendanceByUserId,
    createAttendance,
    getAttendanceWithMonth,
    getLateAttendanceWithMonth,
    updateAttendanceCheckout,
    getAttendancesByUserIdsAndDate,
    getAttendanceWithUsers,
};