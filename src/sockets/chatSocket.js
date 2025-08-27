import { v4 as uuidv4 } from "uuid";
import Message from "../models/message.js";

export default function socketHandler(io, socket) {
    console.log("🔑 Current User:", socket.user);

    socket.on("join", async ({ roomId }) => {
        try {
            socket.join(roomId); // important to join room
            const history = await Message.findAll({
                where: { room_id: roomId },
                order: [["created_at", "ASC"]],
                limit: 20,
            });

            socket.emit("history", history);
            io.to(roomId).emit("userJoined", { user: socket.user });
        } catch (err) {
            console.error("Error in join:", err);
        }
    });

    // Send message
    socket.on("message", async ({ roomId, text }) => {
        try {
            const msg = await Message.create({
                message_id: uuidv4(),
                room_id: roomId,
                user_id: socket.user.id, // 👈 always from token
                content: text,
            });

            io.to(roomId).emit("message", msg);
        } catch (err) {
            console.error("Error sending message:", err);
        }
    });

    // Typing
    socket.on("typing", ({ roomId, isTyping }) => {
        socket.to(roomId).emit("typing", {
            userId: socket.user.id,
            isTyping,
        });
    });

    // Disconnect
    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
}
