import jwt from "jsonwebtoken";

export  function socketAuthMiddleware(socket, next) {
    try {
        const token =
            socket.handshake.auth?.token ||
            socket.handshake.headers?.authorization?.split(" ")[1];

        if (!token) return next(new Error("No token provided"));

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        socket.user = decoded; // attach user payload
        next();
    } catch (err) {
        console.error("❌ Socket auth failed:", err.message);
        next(new Error("Authentication error"));
    }
}
