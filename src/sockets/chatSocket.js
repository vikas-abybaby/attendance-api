import { v4 as uuidv4 } from "uuid";
import Message from "../models/message.js";  // Ensure correct import
import { Op } from "sequelize";

export default function socketHandler(io, socket) {
    // User joins a room
    socket.on("join", async ({ roomId, userId, name }) => {
        try {
            socket.join(roomId);
            console.log(`${name} joined room ${roomId}`);

            // Fetch last 20 messages
            const history = await Message.findAll({
                where: { room_id: roomId },
                order: [["created_at", "ASC"]],
                limit: 20,
            });

            // Send chat history to the newly joined user
            socket.emit("history", history);

            // Notify others in the room
            socket.to(roomId).emit("userJoined", { userId, name });
        } catch (err) {
            console.error("Error in join:", err);
        }
    });

    // Handle sending message
    socket.on("message", async ({ roomId, text, senderId }) => {
        try {
            const msg = await Message.create({
                // If you want UUID as PK, change model accordingly
                message_id: uuidv4(),
                room_id: roomId,
                sender_id: senderId,
                content: text, // Match Sequelize model
            });

            io.to(roomId).emit("message", msg);
        } catch (err) {
            console.error("Error sending message:", err);
        }
    });

    // Typing Indicator
    socket.on("typing", ({ roomId, userId, isTyping }) => {
        socket.to(roomId).emit("typing", { userId, isTyping });
    });

    // Handle disconnection
    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
}
