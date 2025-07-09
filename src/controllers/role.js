const Role = require('../models/role'); // Make sure you require Role


const getRole = async (req, res) => {
    try {
        const roles = await Role.find(); // Fetch all roles
        return res.status(200).json({
            message: 'Roles fetched successfully',
            status_code: 200,
            data: roles,
        });

    } catch (err) {
        res.status(500).json({
            status_code: 500,
            message: 'Failed to fetch roles',
            error: err.message,
        });
    }
};

module.exports = {
    getRole
};
