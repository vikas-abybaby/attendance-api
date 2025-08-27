import Room from '../../models/room.js';
import Helper from "../../utils/index.js";


export const getCreateGroup = async (roomData) => {
    console.log(roomData);

    const newRoom = await Room.create({
        ...roomData.body,
        avatar_url: roomData.file ? roomData.file.filename : null,
    });
    const roomCreate = await newRoom.save();
    const imageUrl = Helper.getImageUrlIfExists(room.avatar_url, 'storage/room')

    roomCreate.avatar_url = imageUrl;

    return roomCreate;
};