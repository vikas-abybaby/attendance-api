
import { v4 as uuidv4 } from "uuid";
import { ChatMessage } from "../models/chatMessage.js";

export default function socketHandler(io, socket) {

    socket.on("join", async ({ roomId, userId, name }) => {
        socket.join(roomId);
        console.log(`${name} joined room ${roomId}`);


        const history = await ChatMessage.findAll({
            where: { roomId },
            order: [["createdAt", "ASC"]],
            limit: 20,
        });

        socket.emit("history", history);

        socket.to(roomId).emit("userJoined", { userId, name });
    });


    socket.on("message", async ({ roomId, text, senderId }) => {
        const msg = await ChatMessage.create({
            id: uuidv4(),
            roomId,
            senderId,
            text,
        });

        io.to(roomId).emit("message", msg);
    });


    socket.on("typing", ({ roomId, userId, isTyping }) => {
        socket.to(roomId).emit("typing", { userId, isTyping });
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
}
