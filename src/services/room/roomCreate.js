import Room from '../../models/room.js';


export const getCreateRoom = async (roomData) => {
    console.log(roomData);

    const newRoom = await Room.create({
        ...roomData.body,
        avatar_url: roomData.file ? roomData.file.filename : null,
    });

    return await newRoom.save();
};