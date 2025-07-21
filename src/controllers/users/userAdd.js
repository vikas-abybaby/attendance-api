import User from '../../models/user.js';
import Services from '../../services/index.js';


export const userAdd = async (req, res) => {
    const { name, email, password, dob, gender } = req.body;

    if (!name || !email || !password || !dob || !gender) {
        return res.status(400).json({ message: 'All required fields must be filled' });
    }

    try {
        const existingUser = await Services.userServices.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const newUser = new User({
            name,
            email,
            password,
            age: req.body.age,
            dob: new Date(dob),
            gender,
            role: req.body.role,
            phone: req.body.phone,
            address: req.body.address,
            department: req.body.department,
            employeeId: req.body.employeeId,
            createdBy: req.body.createdBy || null,
            reportingTo: req.body.reportingTo || null,
        });

        await newUser.save();

        res.status(201).json({
            message: 'User registered successfully',
            status_code: 201,
            data: newUser,
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', status_code: 500, data: null });
    }
};

