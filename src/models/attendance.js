const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    date: {
        type: String,
        required: true
    },
    checkInTime: {
        type: String,
        default: null,
    }, 
    late: {
        type: Boolean,
        default: true,
    },
    checkInLocation: {
        type: String,
        default: null,
    },
    checkOutLocation: {
        type: String,
        default: null,
    },
    checkOutTime: {
        type: String,
        default: null,
    },
    activityLatLong: {
        type: [
            {
                lat: { type: String, required: true },
                long: { type: String, required: true },
                time: { type: String, required: true },
            }
        ],
        default: []
    },
}, { versionKey: false, timestamps: true });

attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
