import Services from '../../services/index.js';



export const userCalebration = async (req, res) => {
    try {
        const birthday = await Services.userServices.getUsersSortedByBirthday();
        const anniversary = await Services.userServices.getUsersSortedByAnniversary();
        return res.status(200).json({
            message: "All users Calebrations",
            status_code: 200,
            data: {
                "birthday": birthday,
                "anniversary": anniversary,
            },
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Server error',
            status_code: 500,
            data: null,
        });
    }
};