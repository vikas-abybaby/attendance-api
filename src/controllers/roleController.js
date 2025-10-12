import services from '../services/index.js';


export const roleGet = async (req, res) => {
    try {
        const roles = await services.roleServices.getRoles();
        return res.status(roles.status).json(roles);
    } catch (error) {
        return responceHelper.error([], "Internal Server Error", 500);

    }
};

export const roleByIdGet = async (req, res) => {
    try {
        const id = req.body.roleId;
        const role = await services.roleServices.getIdByRole(id);
        return res.status(role.status).json(role);
    } catch (error) {
        return responceHelper.error(null, "Internal Server Error", 500);
    }
};