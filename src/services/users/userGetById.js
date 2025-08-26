import User from '../../models/user.js';



export const getUserById = async (userId) => {
    return await User.findOne({
        where: {
            id: userId,
            isActive: true,
        },
        attributes: { exclude: ['password'] },
    });
};
