import User from '../../models/user.js';
import { apiErrorHelper } from '../../utils/index.js'
export const getCreateUser = async (userData) => {

    const newUser = new User({
        ...userData.body,
        dob: userData.body.dob ? new Date(userData.body.dob) : null,
        createdBy: userData.body.createdBy || null,
        reportingTo: userData.body.reportingTo || null,
        profile_url: userData.file ? userData.file.filename : null,
    });


    const saveUser = await newUser.save();

    if (!saveUser) {
        throw new apiErrorHelper(404, 'User not created');
    }

    return saveUser;
};