import Room from '../../models/room.js';
import Helper from "../../utils/index.js";

export const getRooms = async () => {
    const rooms = await Room.findAll({ raw: true });


    const updatedRooms = rooms.map(room => {
        const imageUrl = Helper.getImageUrlIfExists(room.avatar_url, 'storage/room')

        console.log(imageUrl + room.avatar_url);

        return {
            ...room,
            avatar_url: imageUrl,
        };
    });

    return updatedRooms;

};