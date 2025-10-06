import User from "../models/user.js";
import UserToken from "../models/accessToken.js";
import { dateHelper, responceHelper, fileHelper } from '../utils/index.js';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const userLogin = async (loginData) => {
    const currentDate = dateHelper.getTodayIST();

    console.log(currentDate);

    const { email, password } = loginData;
    const user = await User.findOne({ where: { email, status: '1' } });
    if (!user) {
        return responceHelper.error(null, "Invalid email credentials!", 401);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return responceHelper.error(null, "Invalid password!", 401);
    }
    user.lastLogin = currentDate;
    await user.save();
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    if (!token) {
        return responceHelper.error(null, "Token generation failed!", 500);
    }
    const createToken = await UserToken.create({ userId: user.id, token });
    if (!createToken) {
        return responceHelper.error(null, "Failed to save token!", 500);
    }
    const accessToken = `${createToken.id}|${token}`;
    const { password: _, ...userData } = user.get({ plain: true });
    return responceHelper.success({ user: userData, accessToken }, "Login successful", 200);
};

export const getUserById = async (userId) => {
    const userData = await User.findOne({
        where: {
            id: userId,
            status: '1',
        },
        attributes: { exclude: ['password'] },
    });
    if (!userData) {
        return responceHelper.error(null, "Invalid email credentials!", 401);
    }

    const profileUrl = fileHelper.getImageUrlIfExists(userData.profile_url, 'storage/profile')
    userData.profile_url = profileUrl;

    return responceHelper.success(userData, "User Get", 200);
};

export const getAllUsers = async () => {
    return await User.findAll({ where: { status: "1" } }).select('-password');
};


export const getCreateUser = async (userData) => {
    const user = userData.body;
    const roleId = Number(user.roleId);
    const departmentId = Number(user.departmentId);
    const designationId = Number(user.designationId);
    if (roleId === 1) {
        return { success: false, message: 'Not Allowed to Create Role Admin', status_code: 403 };
    }
    if (departmentId === 1) {
        return { success: false, message: 'Not Allowed to Create Department Admin', status_code: 403 };
    }
    if (designationId === 1) {
        return { success: false, message: 'Not Allowed to Create Designation Admin', status_code: 403 };
    }

    try {
        const newUser = await User.create({
            ...userData.body,
            dob: userData.body.dob || null,
            createdBy: userData.body.createdBy || null,
            reportingTo: userData.body.reportingTo || null,
            // profile_url: userData.file?.filename || null,
        });

        return { success: true, message: 'User registered successfully', data: newUser };

    } catch (error) {
        console.error('Error creating user:', error);
        return { success: false, message: 'User not created', status_code: 400 };
    }
};
export const getUpdateUser = async (userData) => {
    console.log("id");

    const { id, ...updates } = userData;

    console.log(id);

    const [count] = await User.update(updates, {
        where: { id },
    });

    return count;
};

export const getEmailByUser = async (email) => {

    try {
        const userData = await User.findOne({ where: { email: email, status: '1' } });
        return userData;
    } catch (error) {
        console.log(error);

    }
    return null;
}; 
