import Services from "../../services/index.js";


export const userProfile = async (req, res) => {
    try {
        const user = Services.getActiveUserById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                status_code: 404,
                data: null
            });
        }

        res.status(200).json({
            message: 'Profile data',
            status_code: 200,
            data: user,
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', status_code: 500, data: null });
    }
};