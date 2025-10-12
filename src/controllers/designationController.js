import services from '../services/index.js';


export const designationGet = async (req, res) => {
    try {
        const designations = await services.designationServices.getDesignations();
        return res.status(designations.status).json(designations);
    } catch (error) {
        return responceHelper.error([], "Internal Server Error", 500);
    }
};

export const designationByIdGet = async (req, res) => {
    try {
        const id = req.body.designationId;
        const designation = await services.designationServices.getIdByDesignation(id);
        return res.status(designation.status).json(designation);
    } catch (error) {
        return responceHelper.error(null, "Internal Server Error", 500);
    }
};