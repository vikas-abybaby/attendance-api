import Designation from '../models/designation.js';
import { responceHelper } from '../utils/index.js';

export const getDesignations = async () => {

    const designations = await Designation.findAll({
        where: {
            status: '1',
        }
    });
    if (!designations) {
        return responceHelper.error(null, "Designation Not Found!", 401);
    }
    return responceHelper.success(designations, "Designation Get", 200);

};
export const getIdByDesignation = async (id) => {


    const designation = await Designation.findOne({
        where: {
            id: id,
            status: '1',
        }
    });
    if (!designation) {
        return responceHelper.error(null, "Designation Not Found!", 401);
    }
    return responceHelper.success(designation, "Designation Get", 200);

};
