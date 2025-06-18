const Attendance = require("../models/attendance");
const User = require('../models/user');


const checkAttendance = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                status_code: 404,
                data: null
            });
        }
        const today = new Date();
        const attendance = await Attendance.findOne({ userId, date: today });

        if (!attendance) {
            return res.status(200).json({
                message: "No attendance record for today",
                status_code: 200,
                data: {
                    checkedIn: false,
                    checkedOut: false
                }
            });
        }

        return res.status(200).json({
            message: "Attendance record found",
            status_code: 200,
            data: {
                checkedIn: !!attendance.checkIn,
                checkedOut: !!attendance.checkOut,
                checkInTime: attendance.checkIn || null,
                checkOutTime: attendance.checkOut || null
            }
        });

    } catch (err) {
        console.error("Error in checkAttendance:", err);
        return res.status(500).json({
            message: 'Server error',
            status_code: 500,
            data: null
        });
    }
};



exports.checkIn = async (req, res) => {
    const userId = req.body.userId;
    const today = new Date().toISOString().split("T")[0];

    try {
        const exists = await Attendance.findOne({ userId, date: today });
        if (exists) {
            return res.status(400).json({ message: "Already checked in today." });
        }

        const newAttendance = await Attendance.create({
            userId,
            date: today,
            checkIn: new Date()
        });

        res.status(201).json({ message: "Checked in", data: newAttendance });
    } catch (err) {
        res.status(500).json({ message: "Check-in failed", error: err.message });
    }
};

exports.checkOut = async (req, res) => {
    const userId = req.body.userId;
    const today = new Date().toISOString().split("T")[0];

    try {
        const attendance = await Attendance.findOne({ userId, date: today });
        if (!attendance) {
            return res.status(404).json({ message: "Check-in not found." });
        }

        if (attendance.checkOut) {
            return res.status(400).json({ message: "Already checked out." });
        }

        attendance.checkOut = new Date();
        await attendance.save();

        res.status(200).json({ message: "Checked out", data: attendance });
    } catch (err) {
        res.status(500).json({ message: "Check-out failed", error: err.message });
    }
};

exports.getUserAttendance = async (req, res) => {
    try {
        const userId = req.params.userId;
        const data = await Attendance.find({ userId }).sort({ date: -1 });
        res.status(200).json({ data });
    } catch (err) {
        res.status(500).json({ message: "Fetch error", error: err.message });
    }
};

exports.getAll = async (req, res) => {
    try {
        const records = await Attendance.find().populate("userId", "name email");
        res.status(200).json({ data: records });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
