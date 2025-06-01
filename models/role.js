const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    roleName: {
        type: String,
        required: true,
        // unique: true
    },

}, {
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: false } // adds `createdAt` field automatically
});

module.exports = mongoose.model('Role', roleSchema);
