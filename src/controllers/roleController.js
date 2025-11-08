import services from '../services/index.js';
import { ApiResponse } from '../utils/index.js';

export const roleGet = async (req, res) => {
    try {
        const roles = await services.roleServices.getRoles();
        return res.status(roles.status).json(roles);
    } catch (error) {
        return ApiResponse.error([], "Internal Server Error", 500);

    }
};

export const roleByIdGet = async (req, res) => {
    try {
        const id = req.body.role_id;
        const role = await services.roleServices.getIdByRole(id);
        return res.status(role.status).json(role);
    } catch (error) {
        return res.status(500).json(
            ApiResponse.error(
                null,
                "Server Error" + error,
                500
            )
        );
    }
};