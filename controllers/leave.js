const Leave = require('../models/Leave');
const User = require('../models/user');
const TodayAttendance = require('../utils/dateHelper')

const addLeave = async (req, res) => {
    try {
        const today = TodayAttendance.getTodayIST();
        const userId = req.user.userId;
        const { startDate = null, endDate = null, reason = null } = req.body;

        if (!startDate || !endDate || !reason) {
            return res.status(400).json({
                message: 'Start date, end date, and reason are required.',
                status_code: 400,
                data: null
            });
        }

        // Check if a leave already exists in that range
        const existingLeave = await Leave.findOne({
            userId,
            $or: [
                {
                    startDate: { $lte: endDate },
                    endDate: { $gte: startDate }
                }
            ]
        });

        if (existingLeave) {
            return res.status(409).json({
                message: 'You have already requested leave during this period.',
                status_code: 409,
                data: existingLeave
            });
        }

        const newLeave = await Leave.create({
            userId,
            startDate: startDate,
            date: today,
            endDate: endDate,
            reason: reason,

        });

        return res.status(201).json({
            message: 'Leave request submitted.',
            status_code: 201,
            data: newLeave
        });

    } catch (error) {
        console.error("Error adding leave:", error);
        return res.status(500).json({
            message: 'Server error.',
            status_code: 500,
            data: null
        });
    }
};
const allLeave = async (req, res) => {

    try {
        const today = TodayAttendance.getTodayIST();
        const { startDate = today, endDate = today } = req.body || {};
        const user = await User.findById(req.user.userId).select('-password');
        let dateFilter = {};
        let filter = [];


        if (startDate && endDate) {
            dateFilter.date = {
                $gte: startDate,
                $lte: endDate
            };
        }
        if (user.role === 'hr') {
            const employeeIds = await User.find({ role: 'employee' }).select('_id');

            const employeeIdStrings = employeeIds.map(u => u._id.toString());
            filter = await Leave.find({
                userId: { $in: employeeIdStrings },
                ...dateFilter
            }).populate('userId', '-password');
        } else if (user.role === 'manager') {
            const employeeIds = await User.find({
                role: { $in: ['employee', 'hr'] }
            }).select('_id');
            const employeeIdStrings = employeeIds.map(u => u._id.toString());
            filter = await Leave.find({
                userId: { $in: employeeIdStrings },
                ...dateFilter
            }).populate('userId', '-password');
        } else if (user.role === 'admin') {
            const employeeIds = await User.find({
                role: { $in: ['manager', 'employee', 'hr'] }
            }).select('_id');
            const employeeIdStrings = employeeIds.map(u => u._id.toString());
            filter = await Leave.find({
                userId: { $in: employeeIdStrings },
                ...dateFilter
            }).populate('userId', '-password');
        } else {
            filter = [];
        }
        const result = filter.map(att => ({
            ...att.userId?.toObject(),
            leave: {
                _id: att._id,
                start_date: att.startDate,
                end_date: att.endDate,
                status: att.status,
                reason: att.reason,
                createdAt: att.createdAt,
                updatedAt: att.updatedAt,
            }
        }));


        res.status(200).json({
            message: 'Leave fetched successfully',
            status_code: 200,
            data: result
        });

    } catch (error) {

        res.status(500).json({
            message: 'Internal Server Error',
            status_code: 500,
            data: null
        });
    }
}

const myLeave = async (req, res) => {
    try {
        const today = TodayAttendance.getTodayIST();
        const { startDate = today, endDate = today } = req.body || {};
        const user = await User.findById(req.user.userId).select('-password');
        let dateFilter = {};
        if (startDate && endDate) {
            dateFilter.date = {
                $gte: startDate,
                $lte: endDate
            };
        }

        const filter = await Leave.find({
            userId: { $in: req.user.userId },
            ...dateFilter
        }).populate('userId', '-password');
        const result = filter.map(att => ({
            ...att.userId?.toObject(),
            leave: {
                _id: att._id,
                start_date: att.startDate,
                end_date: att.endDate,
                status: att.status,
                reason: att.reason,
                createdAt: att.createdAt,
                updatedAt: att.updatedAt,
            }
        }));


        res.status(200).json({
            message: 'Leave fetched successfully',
            status_code: 200,
            data: result
        });


    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error',
            status_code: 500,
            data: null
        });
    }
}

module.exports = { addLeave, allLeave, myLeave };
