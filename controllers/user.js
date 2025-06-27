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
            dob: new Date(req.body.dob,),
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
        res.status(500).json({ message: 'Server error', err, status_code: 500, data: null });
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

        const user = await User.findOne({
            email,
            isActive: true
        });
        if (!user) {
            return res.status(401).json({
                message: 'Invalid email credentials',
                status_code: 401,
                data: null,
            });
        }


        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: 'Invalid password credentials',
                status_code: 401,
                data: null,
            });
        }
        user.lastLogin = new Date();
        await user.save();
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );


        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;


        return res.status(200).json({
            message: 'Login successful',
            status_code: 200,
            data: {
                user: userWithoutPassword,
                access_token: token,
            },
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Internal server error',
            status_code: 500,
            data: null,
        });
    }
};


const userProfile = async (req, res) => {
    try {
        const user = await User.findOne({
            _id: req.user.userId,
            isActive: true
        }).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found', status_code: 404, data: null });
        }

        res.status(200).json({
            message: null,
            status_code: 200,
            data: user
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', status_code: 404, data: null });
    }
};

const userCalebration = async (req, res) => {
    try {
        const today = new Date();
        const currentDay = today.getDate();
        const currentMonth = today.getMonth() + 1;

        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();

        const birthday = await User.aggregate([
            {
                $addFields: {
                    dobDay: { $dayOfMonth: { date: "$dob", timezone: "Asia/Kolkata" } },
                    dobMonth: { $month: { date: "$dob", timezone: "Asia/Kolkata" } }
                }
            },
            {
                $addFields: {
                    nextBirthday: {
                        $dateFromParts: {
                            year: currentYear,
                            month: "$dobMonth",
                            day: "$dobDay",
                            timezone: "Asia/Kolkata"
                        }
                    }
                }
            },
            {
                $addFields: {
                    nextBirthdayAdjusted: {
                        $cond: [
                            { $lt: ["$nextBirthday", currentDate] },
                            {
                                $dateFromParts: {
                                    year: currentYear + 1,
                                    month: "$dobMonth",
                                    day: "$dobDay",
                                    timezone: "Asia/Kolkata"
                                }
                            },
                            "$nextBirthday"
                        ]
                    },
                    isTodayBirthday: {
                        $cond: [
                            {
                                $and: [
                                    { $eq: ["$dobDay", currentDay] },
                                    { $eq: ["$dobMonth", currentMonth] }
                                ]
                            },
                            1,
                            0
                        ]
                    }
                }
            },
            {
                $sort: {
                    isTodayBirthday: -1,
                    nextBirthdayAdjusted: 1
                }
            },
            {
                $project: {
                    password: 0,
                    isTodayBirthday: 0,
                    dobDay: 0,
                    dobMonth: 0,
                    nextBirthday: 0,
                    nextBirthdayAdjusted: 0
                }
            }
        ]);
        const anniversary = await User.aggregate([
            {
                $addFields: {
                    joinDay: { $dayOfMonth: { date: "$joiningDate", timezone: "Asia/Kolkata" } },
                    joinMonth: { $month: { date: "$joiningDate", timezone: "Asia/Kolkata" } }
                }
            },
            {
                $addFields: {
                    nextAnniversary: {
                        $dateFromParts: {
                            year: currentYear,
                            month: "$joinMonth",
                            day: "$joinDay",
                            timezone: "Asia/Kolkata"
                        }
                    }
                }
            },
            {
                $addFields: {
                    nextAnniversaryAdjusted: {
                        $cond: [
                            { $lt: ["$nextAnniversary", today] },
                            {
                                $dateFromParts: {
                                    year: currentYear + 1,
                                    month: "$joinMonth",
                                    day: "$joinDay",
                                    timezone: "Asia/Kolkata"
                                }
                            },
                            "$nextAnniversary"
                        ]
                    },
                    isTodayAnniversary: {
                        $cond: [
                            {
                                $and: [
                                    { $eq: ["$joinDay", currentDay] },
                                    { $eq: ["$joinMonth", currentMonth] }
                                ]
                            },
                            1,
                            0
                        ]
                    }
                }
            },
            {
                $sort: {
                    isTodayAnniversary: -1,
                    nextAnniversaryAdjusted: 1
                }
            },
            {
                $project: {
                    password: 0,
                    isTodayAnniversary: 0,
                    joinDay: 0,
                    joinMonth: 0,
                    nextAnniversary: 0,
                    nextAnniversaryAdjusted: 0
                }
            }
        ]);
        return res.status(200).json({
            message: "All users Calebrations",
            status_code: 200,
            data: {
                "birthday": birthday,
                "anniversary": anniversary,

            }
        });

    } catch (err) {
        console.error("Error fetching birthdays:", err);
        return res.status(500).json({
            message: 'Server error',
            status_code: 500,
            data: null
        });
    }
};












module.exports = {
    createUser,
    getAllUsers,
    updateUserById,
    userLogin,
    userProfile,
    userCalebration,
}