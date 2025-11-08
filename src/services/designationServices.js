import Designation from '../models/designation.js';
import { ApiResponse } from '../utils/index.js';

export const getDesignations = async () => {

    const designations = await Designation.findAll({
        where: {
            status: '1',
        }
    });
    if (!designations) {
        return ApiResponse.error(null, "Designation Not Found!", 401);
    }
    return ApiResponse.success(designations, "Designation Get", 200);

};
export const getIdByDesignation = async (id) => {


    const designation = await Designation.findOne({
        where: {
            id: id,
            status: '1',
        }
    });
    if (!designation) {
        return ApiResponse.error(null, "Designation Not Found!", 401);
    }
    return ApiResponse.success(designation, "Designation Get", 200);

};
