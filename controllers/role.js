const Role = require('../models/role'); // Make sure you require Role

const createRole = async (req, res) => {
    try {
        const roleName = req.body.roleName;

        const existing = await Role.findOne({ roleName: roleName });
        if (existing) return res.status(400).json({ message: 'Role already exists' });

        const role = new Role({ roleName });
        await role.save();

        res.status(201).json({ message: 'Role created', role });
    } catch (err) {
        res.status(200).json({ error: err.message });
    }
};

// const editRole = async (req, res) => {
//     try {
//         const { id } = req.params; // role id from URL
//         const { roleName, roleId } = req.body;

//         // Check if role exists
//         const role = await Role.findById(id);
//         if (!role) return res.status(404).json({ message: 'Role not found' });

//         // Optional: check for duplicates except current role
//         const duplicate = await Role.findOne({
//             $or: [{ roleName }, { roleId }],
//             _id: { $ne: id }
//         });
//         if (duplicate) return res.status(400).json({ message: 'Role with same name or ID already exists' });

//         // Update role fields
//         role.roleName = roleName || role.roleName;
//         role.roleId = roleId || role.roleId;

//         await role.save();

//         res.status(200).json({ message: 'Role updated', role });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

module.exports = {
    createRole,
    // editRole,
};
