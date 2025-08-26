import Services from '../../services/index.js';


export const userCreateRoom = async (req, res) => {
    try {
        const existingRoom = await Services.roomServices.getRoomByName(req.body.name);
        if (existingRoom) {
            return res.status(400).json({
                message: 'Room already exists',
                status_code: 400,
                data: null,
            });
        }

        console.log("body", req.body);
        console.log("file", req.file);

        const creatRoom = await Services.roomServices.getCreateRoom(req);

        if (!creatRoom) {
            return res.status(400).json({
                message: 'Room Not Created',
                status_code: 400,
                data: null,
            });
        }
        return res.status(400).json({
            message: '',
            status_code: 400,
            data: creatRoom,
        });
    } catch (error) {
        return res.status(400).json({
            message: 'Server Error' + error,
            status_code: 400,
            data: null,
        });
    }
}