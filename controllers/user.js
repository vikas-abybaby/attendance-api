const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const auth = require('../middlewares/user');



const createUser = async (req, res) => {


    const { name, email, password, dob, gender } = req.body;


    if (!name || !email || !password || !dob || !gender) {
        return res.status(400).json({ message: 'All required fields must be filled' });
    }

    try {

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }


        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            age: req.body.age,
            dob: req.body.dob,
            gender: req.body.gender,
            role: req.body.role,
            phone: req.body.phone,
            address: req.body.address,
            department: req.body.department,
            employeeId: req.body.employeeId,
            createdBy: req.body.createdBy || null,
            reportingTo: req.body.reportingTo || null,
        });


        await newUser.save();

        res.status(201).json({ message: 'User registered successfully', status_code: 201, data: newUser });

    } catch (err) {
        res.status(500).json({ message: 'Server error', status_code: 500, data: null });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json({ message: 'All User', status_code: 200, data: users });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


const updateUserById = async (req, res) => {
    try {
        console.log('Request body:', req.body);


        const userId = req.body.id;
        const updates = req.body;

        const updatedUser = await User.findByIdAndUpdate(userId, updates, {
            new: true,
            runValidators: true,
        });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found', status_code: 404, data: null });
        }

        const userObj = updatedUser.toObject();
        userObj.id = userObj._id;
        delete userObj._id;
        delete userObj.__v;

        res.status(200).json({ message: 'User updated', status_code: 200, data: userObj });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', status_code: 500, data: null });
    }
};

const userLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Invalid Email credentials', status_code: 401, data: null });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid Password credentials', status_code: 401, data: null });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });


        return res.status(200).json({
            status_code: 200,
            data: {
                data: user,
                access_token: token,
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', status_code: 500, data: null });
    }
};


const userProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password'); // Exclude password

        if (!user) {
            return res.status(404).json({ message: 'User not found', status_code: 404, data: null });
        }

        res.status(200).json({
            message: 'Profile data',
            status_code: 200,
            data: user
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', status_code: 404, data: null });
    }
};
module.exports = {
    createUser,
    getAllUsers,
    updateUserById,
    userLogin,
    userProfile,
}