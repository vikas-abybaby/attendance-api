import services from '../services/index.js';
import { responceHelper } from '../utils/index.js'
export const userLogin = async (req, res) => {
    try {
        const loginUser = req.body;
        const loginData = await services.userServices.userLogin(loginUser);
        return res.status(loginData.status).json(loginData);
    } catch (error) {
        return res.status(500).json({
            message: 'Server error: ' + error.message,
            status_code: 500,
            data: null
        });
    }
};

export const userProfile = async (req, res) => {
    try {

        const currentUser = req.userId;

        const user = await services.userServices.getUserById(currentUser);
        return res.status(user.status).json(user);
    } catch (err) {
        res.status(500).json({
            message: 'Server error' + err,
            status_code: 500,
            data: null
        });
    }
};

export const userGet = async (req, res) => {
    try {
        const filter = req.body;
        const users = await services.userServices.getAllUsers(filter);
        return res.status(users.status).json(users);

    } catch (error) {
        res.status(500).json({
            message: 'Server error' + error,
            status_code: 500,
            data: null
        });
    }
};

export const userAdd = async (req, res) => {
    const email = req.body.email;
    const existingUser = await services.userServices.getEmailByUser(email);
    if (existingUser) {
        return res.status(400).json({
            message: 'Email already exists',
            status_code: 400,
            data: null,
        });
    }
    const result = await services.userServices.getCreateUser(req);
    if (!result.success) {
        return res.status(result.status_code || 400).json({
            message: result.message,
            status_code: result.status_code || 400,
            data: null
        });
    }
    res.status(201).json({
        message: result.message,
        status_code: 201,
        data: result.data,
    });
}

export const userEdit = async (req, res) => {
    try {
        const userData = req.body;
        const userId = req.body.id;
        const updatedUser = await services.userServices.getUpdateUser(userData);
        if (updatedUser === 0) {
            return res.status(404).json({
                message: 'User not found',
                status_code: 404,
                data: null
            });
        }

        res.status(200).json({
            message: 'User updated',
            status_code: 200,
            data: updatedUser
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error' + error,
            status_code: 500,
            data: null
        });
    }
};

export const userBirthday = async (req, res) => {

    const filter = req.body;

    const birthday = await services.userServices.getUsersBirthday(filter);
    if (!birthday.success) {
        return res.status(birthday.status_code || 400).json({
            message: birthday.message,
            status_code: birthday.status_code || 400,
            data: null
        });
    }
    res.status(201).json({
        message: birthday.message,
        status_code: 200,
        data: birthday.data,
    });

};
export const userWorkAnniversary = async (req, res) => {
    const filter = req.body;

    const workAnniversary = await services.userServices.getUsersWorkAnniversary(filter);
    if (!workAnniversary.success) {
        return res.status(workAnniversary.status_code || 400).json({
            message: workAnniversary.message,
            status_code: workAnniversary.status_code || 400,
            data: null
        });
    }
    res.status(201).json({
        message: workAnniversary.message,
        status_code: 200,
        data: workAnniversary.data,
    });

};
