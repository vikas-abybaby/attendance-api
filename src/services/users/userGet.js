import User from '../../models/user.js';

export const getUsers = async () => {
    return await User.find({}).select('-password');
};