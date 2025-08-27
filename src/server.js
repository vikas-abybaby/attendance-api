import sequelize from "./config/connection.js";
import app from './app.js';
import { createServer } from "http";
import { Server } from "socket.io";
import socketHandler from "./sockets/chatSocket.js";
import authMiddleware from './middlewares/index.js';


const server = createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});
io.use(authMiddleware.socketAuthMiddleware);
io.on("connection", (socket) => {
  console.log("🔌 New client connected:", socket.id);
  socketHandler(io, socket);
});

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Tables created/updated!");

    server.listen(8001, () => {
      console.log(`✅ API + Socket.IO running at http://10.241.172.249:8001`);
    });
  })
  .catch((err) => {
    console.error("Error syncing:", err);
  });

