import User from '../../models/user.js';

export const getUsers = async () => {
    const users = await User.find({}).select('-password');
    if (!users || users.length === 0) {
        throw new apiErrorHelper(404, 'No users found');
    }
    return users;
};