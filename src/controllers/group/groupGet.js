import Services from "../../services/index.js";


export const groupGet = async (req, res) => {

    try {
        const room = await Services.groupServices.getRooms();
        return res.status(200).json({
            message: '',
            status_code: 200,
            data: room || null,
        });

    } catch (error) {
        return res.status(400).json({
            message: 'Server Error' + error,
            status_code: 400,
            data: null,
        });
    }

}