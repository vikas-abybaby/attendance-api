import Services from "../../services/index.js";
import Helper from '../../utils/index.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';


export const userLogin = async (req, res) => {
    const { email, password } = req.body;
    const currentDate = Helper.getTodayIST();
    try {
        const user = await Services.getUserByEmail(email);
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

        user.lastLogin = currentDate;
        await user.save();

        const token = jwt.sign(
            {
                userId: user._id,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1d',
            }
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