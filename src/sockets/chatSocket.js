import { v4 as uuidv4 } from "uuid";
import Message from "../models/message.js";

export default function socketHandler(io, socket) {

    socket.on("join", async ({ roomId, userId, name }) => {
        try {
            socket.join(roomId);
            console.log(`${name} joined room ${roomId}`);


            const history = await Message.findAll({
                where: { room_id: roomId },
                order: [["created_at", "ASC"]],
                limit: 20,
            });


            socket.emit("history", history);


            socket.to(roomId).emit("userJoined", { userId, name });
        } catch (err) {
            console.error("Error in join:", err);
        }
    });


    socket.on("message", async ({ roomId, text, senderId }) => {
        try {
            const msg = await Message.create({

                message_id: uuidv4(),
                room_id: roomId,
                sender_id: senderId,
                content: text,
            });

            io.to(roomId).emit("message", msg);
        } catch (err) {
            console.error("Error sending message:", err);
        }
    });


    socket.on("typing", ({ roomId, userId, isTyping }) => {
        socket.to(roomId).emit("typing", { userId, isTyping });
    });


    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
}
