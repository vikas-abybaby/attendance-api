import User from "../models/user.js";
import Role from "../models/role.js";
import Department from "../models/department.js";
import Designation from "../models/designation.js";
import UserToken from "../models/accessToken.js";
import { Op, fn, col, literal } from 'sequelize';
import { dateHelper, fileHelper, ApiError } from '../utils/index.js';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const userLogin = async (loginData) => {
    const currentDate = dateHelper.getTodayIST();
    const { email, password } = loginData;

    const user = await User.findOne({ where: { email, status: '1' } });
    if (!user) {
        throw new ApiError(401, 'Invalid email credentials!');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new ApiError(401, 'Invalid password!');
    }

    user.lastLogin = currentDate;
    await user.save();
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    if (!token) {
        throw new ApiError(500, 'Token generation failed!');
    }

    const createToken = await UserToken.create({ userId: user.id, token });
    if (!createToken) {
        throw new ApiError(500, 'Failed to save token!');
    }

    const accessToken = `${createToken.id}|${token}`;

    const userData = user;
    delete userData.password;
    const roleId = userData.roleId;
    const departmentId = userData.departmentId;
    const designationId = userData.designationId;
    const [roleData, departmentData, designationData] = await Promise.all([
        Role.findOne({ where: { id: roleId, status: '1' } }),
        Department.findOne({ where: { id: departmentId, status: '1' } }),
        Designation.findOne({ where: { id: designationId, status: '1' } })
    ]);

    if (!roleData) throw new ApiError(401, 'Invalid Role!');
    if (!departmentData) throw new ApiError(401, 'Invalid Department!');
    if (!designationData) throw new ApiError(401, 'Invalid Designation!');

    userData.profile_url = fileHelper.getImageUrlIfExists(userData.profile_url, 'storage/profile');
    userData.roleName = roleData.role_name;
    userData.designationName = designationData.designation_name;
    userData.departmentName = departmentData.department_name;
    const loginUserData = { user: userData, accessToken: accessToken }
    return loginUserData;
};

export const getUserById = async (userId) => {
    const user_id = userId;
    const userData = await User.findOne({
        where: {
            id: user_id,
            status: '1',
        },
        attributes: { exclude: ['password'] },
    });
    if (!userData) {
        throw new ApiError(401, 'Invalid userId!');
    }
    const roleId = userData.roleId;
    const departmentId = userData.departmentId;
    const designationId = userData.designationId;

    const [roleData, departmentData, designationData] = await Promise.all([
        Role.findOne({ _id: roleId, status: '1' }),
        Department.findOne({ _id: departmentId, status: '1' }),
        Designation.findOne({ _id: designationId, status: '1' })
    ]);

    if (!roleData) throw new ApiError(401, 'Invalid Role!');
    if (!departmentData) throw new ApiError(401, 'Invalid Department!');
    if (!designationData) throw new ApiError(401, 'Invalid Designation!');

    const profileUrl = fileHelper.getImageUrlIfExists(userData.profile_url, 'storage/profile')
    userData.profile_url = profileUrl;

    const result = {
        ...userData.toJSON(),
        roleName: roleData.role_name,
        departmentName: designationData.designation_name,
        designationName: departmentData.department_name,
    };
    return result;
};

export const getAllUsers = async (filter) => {
    const { designation_id, role_id, department_id, status, skip, take } = filter;
    const parseIds = (value) =>
        value ? value.split(',').map((id) => id.trim()) : [];

    const designationIds = parseIds(designation_id);
    const roleIds = parseIds(role_id).filter((id) => id !== '1');
    const departmentIds = parseIds(department_id);
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

    const offset = Number(skip) || 0;
    const limit = Number(take) || 10;
    const users = await User.findAll({
        where: whereCondition,
        attributes: { exclude: ['password'] },
        offset,
        limit,
        order: [["id", "DESC"]],
    });

    if (!users.length) {
        throw new ApiError(200, 'User Not Found');
    }
    const enrichedUsers = await Promise.all(
        users.map(async (user) => {
            const roleData = await Role.findOne({ where: { id: user.roleId, status: '1' } });
            const deptData = await Department.findOne({ where: { id: user.departmentId, status: '1' } });
            const desigData = await Designation.findOne({ where: { id: user.designationId, status: '1' } });
            if (!roleData || !deptData || !desigData) {
                return null;
            }
            user.profile_url = fileHelper.getImageUrlIfExists(user.profile_url, 'storage/profile');

            const result = {
                ...user.toJSON(),
                roleName: roleData.role_name,
                departmentName: desigData.designation_name,
                designationName: deptData.department_name,
            };

            return result;
        })
    );
    const validUsers = enrichedUsers.filter((u) => u !== null);
    return validUsers;

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
        return { success: false, message: 'Email not received', status_code: 400 };
    }
};

export const getUsersBirthday = async (filter) => {
    try {
        const { designation_id, role_id, department_id, status, skip = 0, take = 10 } = filter;
        const { currentDay, currentMonth, currentYear } = dateHelper.getISTDateParts();
        const today = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(currentDay).padStart(2, '0')}`;

        const parseIds = (value) => value ? value.split(',').map((id) => id.trim()) : [];
        const designationIds = parseIds(designation_id);
        const roleIds = parseIds(role_id);
        const departmentIds = parseIds(department_id);

        let filterStatus = '1';
        if (typeof status === 'number') filterStatus = status.toString();
        else if (typeof status === 'string') filterStatus = status;

        const nextMonths = [
            currentMonth,
            (currentMonth % 12) + 1,
            ((currentMonth + 1) % 12) + 1,
        ];

        const whereClause = {
            status: filterStatus,
            ...(designationIds.length && { designationId: { [Op.in]: designationIds } }),
            ...(roleIds.length && { roleId: { [Op.in]: roleIds } }),
            ...(departmentIds.length && { departmentId: { [Op.in]: departmentIds } }),
            [Op.or]: nextMonths.map((m) => literal(`MONTH(dob) = ${m}`)),
        };
        const users = await User.findAll({
            attributes: {
                include: [
                    [fn('DAY', col('dob')), 'dobDay'],
                    [fn('MONTH', col('dob')), 'dobMonth'],
                    [
                        literal(`
            CASE
              WHEN STR_TO_DATE(CONCAT('${currentYear}-', LPAD(MONTH(dob),2,'0'), '-', LPAD(DAY(dob),2,'0')), '%Y-%m-%d') < '${today}'
              THEN STR_TO_DATE(CONCAT('${currentYear + 1}-', LPAD(MONTH(dob),2,'0'), '-', LPAD(DAY(dob),2,'0')), '%Y-%m-%d')
              ELSE STR_TO_DATE(CONCAT('${currentYear}-', LPAD(MONTH(dob),2,'0'), '-', LPAD(DAY(dob),2,'0')), '%Y-%m-%d')
            END
          `),
                        'nextBirthday',
                    ],
                    [
                        literal(`
            CASE
              WHEN MONTH(dob) = ${currentMonth} AND DAY(dob) = ${currentDay} THEN 1
              ELSE 0
            END
          `),
                        'isTodayBirthday',
                    ],
                ],
                exclude: ['password'],
            },
            where: whereClause,
            order: [
                [literal('isTodayBirthday'), 'DESC'],
                [literal('nextBirthday'), 'ASC'],
            ],
            offset: skip,
            limit: take,
        });
        return { success: true, message: 'User Birthday', data: users, status_code: 200 };
    } catch (error) {
        return { success: false, message: 'Birthday not received', data: null, status_code: 400 };
    }
};

export const getUsersWorkAnniversary = async (filter) => {
    try {
        const { designation_id, role_id, department_id, status, skip = 0, take = 10 } = filter;
        const { currentDay, currentMonth, currentYear } = dateHelper.getISTDateParts();
        const today = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(currentDay).padStart(2, '0')}`;

        const parseIds = (value) => value ? value.split(',').map((id) => id.trim()) : [];
        const designationIds = parseIds(designation_id);
        const roleIds = parseIds(role_id);
        const departmentIds = parseIds(department_id);

        let filterStatus = '1';
        if (typeof status === 'number') filterStatus = status.toString();
        else if (typeof status === 'string') filterStatus = status;

        const nextMonths = [
            currentMonth,
            (currentMonth % 12) + 1,
            ((currentMonth + 1) % 12) + 1,
        ];

        const whereClause = {
            status: filterStatus,
            ...(designationIds.length && { designationId: { [Op.in]: designationIds } }),
            ...(roleIds.length && { roleId: { [Op.in]: roleIds } }),
            ...(departmentIds.length && { departmentId: { [Op.in]: departmentIds } }),
            [Op.or]: nextMonths.map((m) => literal(`MONTH(joiningDate) = ${m}`)),
        };
        const users = await User.findAll({
            attributes: {
                include: [
                    [fn('DAY', col('joiningDate')), 'joiningDateDay'],
                    [fn('MONTH', col('joiningDate')), 'joiningDateMonth'],
                    [
                        literal(`
            CASE
              WHEN STR_TO_DATE(CONCAT('${currentYear}-', LPAD(MONTH(joiningDate),2,'0'), '-', LPAD(DAY(joiningDate),2,'0')), '%Y-%m-%d') < '${today}'
              THEN STR_TO_DATE(CONCAT('${currentYear + 1}-', LPAD(MONTH(joiningDate),2,'0'), '-', LPAD(DAY(joiningDate),2,'0')), '%Y-%m-%d')
              ELSE STR_TO_DATE(CONCAT('${currentYear}-', LPAD(MONTH(joiningDate),2,'0'), '-', LPAD(DAY(joiningDate),2,'0')), '%Y-%m-%d')
            END
          `),
                        'nextBirthday',
                    ],
                    [
                        literal(`
            CASE
              WHEN MONTH(joiningDate) = ${currentMonth} AND DAY(joiningDate) = ${currentDay} THEN 1
              ELSE 0
            END
          `),
                        'isTodayBirthday',
                    ],
                ],
                exclude: ['password'],
            },
            where: whereClause,
            order: [
                [literal('isTodayBirthday'), 'DESC'],
                [literal('nextBirthday'), 'ASC'],
            ],
            offset: skip,
            limit: take,
        });
        return { success: true, message: 'User registered successfully', data: users };
    } catch (error) {
        return { success: false, message: 'Birthday not received', status_code: 400 };
    }
};
