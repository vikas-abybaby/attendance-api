import Role from '../models/role.js';

export const getRoles = async () => {
    try {
        const roles = await Role.findAll({
            where: {
                id: { [Op.ne]: 1 }
            }
        });
        return roles;
    } catch (error) {
        console.error('Error fetching roles:', error);
        throw error;
    }
};
export const getIdByRole = async (id) => {
    try {
        if (id === 1) return null;
        const role = await Role.findOne({
            where: { id }
        });
        return role;
    } catch (error) {
        console.error('Error fetching role:', error);
        throw error;
    }
};
