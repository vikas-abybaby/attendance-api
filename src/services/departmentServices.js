import Department from '../models/department.js';
import { responceHelper } from '../utils/index.js';

export const getDepartments = async () => {

    const departments = await Department.findAll({
        where: {
            status: '1',
        }
    });
    if (!departments) {
        return responceHelper.error(null, "Department Not Found!", 401);
    }
    return responceHelper.success(departments, "Department Get", 200);

};
export const getIdByDepartment = async (id) => {
    
    const department = await Department.findOne({
        where: {
            id: id,
            status: '1',
        }
    });
    if (!department) {
        return responceHelper.error(null, "Department Not Found!", 401);
    }
    return responceHelper.success(department, "Department Get", 200);

};
