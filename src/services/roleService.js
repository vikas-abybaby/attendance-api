import Role from '../models/role.js';
import { responceHelper } from '../utils/index.js';

export const getRoles = async () => {

    const roles = await Role.findAll({
        where: {
            id: { [Op.ne]: 1 },
            status: '1',
        }
    });
    if (!roles) {
        return responceHelper.error(null, "Role Not Found!", 401);
    }
    return responceHelper.success(roles, "Role Get", 200);


};
export const getIdByRole = async (id) => {

    if (id === 1) return responceHelper.error(null, "Admin Role Not Allowed !", 401);

    const roles = await Role.findOne({
        where:
        {
            id: id,
            status: '1'
        }
    });

    if (!roles) {
        return responceHelper.error(null, "Role Not Found!", 401);
    }
    return responceHelper.success(roles, "Role Get", 200);

};
