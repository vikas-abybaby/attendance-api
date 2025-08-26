import Services from '../../services/index.js';


export const userAdd = async (req, res) => {
    try {
        const existingUser = await Services.userServices.getUserByEmail(req.body.email);
        if (existingUser) {
            return res.status(400).json({
                message: 'Email already exists',
                status_code: 400,
                data: null,
            });
        }

        const newUser = await Services.userServices.getCreateUser(req);
        if (!newUser) {
            return res.status(400).json({
                message: "User not created",
                status_code: 400,
                data: null,
            });
        }
        res.status(201).json({
            message: 'User registered successfully',
            status_code: 201,
            data: newUser,
        });
    } catch (err) {
        res.status(500).json({
            message: 'Server error' + err,
            status_code: 500,
            data: null
        });
    }
};

