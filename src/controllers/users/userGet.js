import Services from '../../services/index.js';


export const userGet = async (req, res) => {
    try {
        const users = await Services.getAllUsers();
        res.status(200).json({
            message: 'All Active User',
            status_code: 200,
            data: users,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error',
            status_code: 500,
            data: [],
        });
    }
};
