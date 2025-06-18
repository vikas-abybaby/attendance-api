const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    roleName: {
        type: String,
        required: true,
    },

}, {
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: false }
});

module.exports = mongoose.model('Role', roleSchema);
