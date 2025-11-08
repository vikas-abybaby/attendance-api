import Department from '../models/department.js';
import { ApiResponse } from '../utils/index.js';

export const getDepartments = async () => {

    const departments = await Department.findAll({
        where: {
            status: '1',
        }
    });
    if (!departments) {
        return ApiResponse.error(null, "Department Not Found!", 401);
    }
    return ApiResponse.success(departments, "Department Get", 200);

};
export const getIdByDepartment = async (id) => {
    
    const department = await Department.findOne({
        where: {
            id: id,
            status: '1',
        }
    });
    if (!department) {
        return ApiResponse.error(null, "Department Not Found!", 401);
    }
    return ApiResponse.success(department, "Department Get", 200);

};
