import User from '../../models/user.js';

export const getCreateUser = async (userData) => {

    const newUser = new User({
        ...userData.body,
        dob: userData.body.dob ? new Date(userData.body.dob) : null,
        createdBy: userData.body.createdBy || null,
        reportingTo: userData.body.reportingTo || null,
        profile_url: userData.file ? userData.file.filename : null,
    });

    return await newUser.save();
};