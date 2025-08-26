import User from '../../models/user.js';


export const getUserByEmail = async (email) => {
    return await User.findOne({ email, isActive: true });
};