
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    dob: { type: Date, required: true },
    age: { type: Number },
    gender: { type: String, required: true },
    role: { type: String, enum: ['admin', 'manager', 'employee', 'hr'], default: 'employee' },
    phone: { type: String },
    address: { type: String },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date, default: null },
    fcmToken: { type: String, default: null },
    platform: { type: String, enum: ['android', 'ios', 'web'], default: null },
    profilePicUrl: { type: String, default: null },
    department: { type: String },
    employeeId: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    reportingTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, {
    versionKey: false,
    timestamps: true
});


userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        return next(err);
    }
});


userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);
