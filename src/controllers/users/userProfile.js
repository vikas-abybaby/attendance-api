import Services from "../../services/index.js";
import Helper from "../../utils/index.js";


export const userProfile = async (req, res) => {
    try {
        const user = await Services.userServices.getUserById(req.user.userId);
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                status_code: 404,
                data: null
            });
        }
        const profileUrl = Helper.getImageUrlIfExists(user.profile_url, 'storage/profile')
        user.profile_url = profileUrl;
        res.status(200).json({
            message: 'Profile data',
            status_code: 200,
            data: user,
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' + err, status_code: 500, data: null });
    }
};