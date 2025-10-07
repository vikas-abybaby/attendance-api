import User from "../models/user.js";
import Role from "../models/role.js";
import Department from "../models/department.js";
import Designation from "../models/designation.js";
import UserToken from "../models/accessToken.js";
import { Op } from 'sequelize';
import { dateHelper, responceHelper, fileHelper } from '../utils/index.js';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const userLogin = async (loginData) => {
    const currentDate = dateHelper.getTodayIST();
    const { email, password } = loginData;
    const user = await User.findOne({ where: { email, status: '1' } });
    if (!user) {
        return responceHelper.error(null, "Invalid email credentials!", 401);
    }
    const roleId = user.roleId;
    const departmentId = user.departmentId;
    const designationId = user.designationId;
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

    const roleData = await Role.findOne({ where: { id: roleId, status: '1' } });
    if (!roleData) {
        return responceHelper.error(null, "Invalid Role!", 401);
    }
    const departmentData = await Department.findOne({ where: { id: departmentId, status: '1' } });
    if (!departmentData) {
        return responceHelper.error(null, "Invalid Department!", 401);
    }
    const designationData = await Designation.findOne({ where: { id: designationId, status: '1' } });
    if (!designationData) {
        return responceHelper.error(null, "Invalid Designation!", 401);
    }

    const profileUrl = fileHelper.getImageUrlIfExists(userData.profile_url, 'storage/profile')
    userData.profile_url = profileUrl;
    userData.roleName = roleData.role_name;
    userData.designationName = designationData.designation_name;
    userData.departmentName = departmentData.department_name;

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
    const roleId = userData.roleId;
    const departmentId = userData.departmentId;
    const designationId = userData.designationId;

    const roleData = await Role.findOne({ where: { id: roleId, status: '1' } });
    if (!roleData) {
        return responceHelper.error(null, "Invalid Role!", 401);
    }
    const departmentData = await Department.findOne({ where: { id: departmentId, status: '1' } });
    if (!departmentData) {
        return responceHelper.error(null, "Invalid Department!", 401);
    }
    const designationData = await Designation.findOne({ where: { id: designationId, status: '1' } });
    if (!designationData) {
        return responceHelper.error(null, "Invalid Designation!", 401);
    }


    const profileUrl = fileHelper.getImageUrlIfExists(userData.profile_url, 'storage/profile')
    userData.profile_url = profileUrl;
    userData.roleName = roleData.role_name;
    userData.designationName = designationData.designation_name;
    userData.departmentName = departmentData.department_name;


    return responceHelper.success(userData, "User Get", 200);
};


export const getAllUsers = async (filter) => {
    const { designation_id, role_id, department_id, status } = filter;
    const parseIds = (value) =>
        value ? value.split(',').map((id) => id.trim()) : [];

    const designationIds = parseIds(filter.designation_id);
    const roleIds = parseIds(filter.role_id).filter((id) => id !== '1');
    const departmentIds = parseIds(filter.department_id);
    let filterStatus = '1';

    if (typeof status === 'number') {
        filterStatus = status.toString();
    } else if (typeof status === 'string') {
        filterStatus = status;
    } else {
        filterStatus = '1';
    }
    const whereCondition = {
        roleId: { [Op.ne]: 1 },
        status: filterStatus,
    };

    if (designationIds.length > 0) {
        whereCondition.designationId = { [Op.in]: designationIds };
    }
    if (roleIds.length > 0) {
        whereCondition.roleId = { [Op.in]: roleIds };
    }
    if (departmentIds.length > 0) {
        whereCondition.departmentId = { [Op.in]: departmentIds };
    }


    try {
        const users = await User.findAll({
            where: whereCondition,
            attributes: { exclude: ['password'] },
        });

        if (!users.length) {
            return responceHelper.success([], "No users found", 200);
        }
        const enrichedUsers = await Promise.all(
            users.map(async (user) => {
                const roleData = await Role.findOne({ where: { id: user.roleId, status: '1' } });
                const deptData = await Department.findOne({ where: { id: user.departmentId, status: '1' } });
                const desigData = await Designation.findOne({ where: { id: user.designationId, status: '1' } });
                if (!roleData || !deptData || !desigData) {
                    return null;
                }
                const userData = user.toJSON();
                userData.profile_url = fileHelper.getImageUrlIfExists(user.profile_url, 'storage/profile');
                userData.roleName = roleData.role_name;
                userData.departmentName = deptData.department_name;
                userData.designationName = desigData.designation_name;
                return userData;
            })
        );
        const validUsers = enrichedUsers.filter((u) => u !== null);
        return responceHelper.success(validUsers, "Users fetched successfully", 200);
    } catch (error) {
        return responceHelper.error(null, "Failed to fetch users", 500);
    }
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
