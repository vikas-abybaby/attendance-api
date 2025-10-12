import services from '../services/index.js';


export const departmentGet = async (req, res) => {
    try {
        const departments = await services.departmentServices.getDepartments();
        return res.status(departments.status).json(departments);
    } catch (error) {
        return responceHelper.error([], "Internal Server Error", 500);
    }
};

export const departmentByIdGet = async (req, res) => {
    try {
        const id = req.body.departmentId;
        const department = await services.departmentServices.getIdByDepartment(id);
        return res.status(department.status).json(department);
    } catch (error) {
        return responceHelper.error(null, "Internal Server Error", 500);
    }
};