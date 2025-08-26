import User from '../../models/user.js';

export const getCreateUser = async () => {

    const newUser = new User({
        ...userData,
        dob: userData.dob ? new Date(userData.dob) : null,
        createdBy: userData.createdBy || null,
        reportingTo: userData.reportingTo || null,
    });

    return await newUser.save();
};