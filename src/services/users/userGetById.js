import User from '../../models/user.js';



export const getUserById = async (userId) => {
    return await User.findOne({
        _id: userId,
        isActive: true,
    }).select('-password');
};