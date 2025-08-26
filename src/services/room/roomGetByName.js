
import Room from '../../models/room.js';

export const getRoomByName = async (name) => {

    const existingRoom = await Room.findOne({
        where: { name: name },
    });

    return existingRoom;
}