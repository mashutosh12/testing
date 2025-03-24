import { Server } from "socket.io";

const initSocket = (server) => {
  const io = new Server(server, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    console.log("⚡ User Connected:", socket.id);

    // 🆘 Panic Alert Event (New Feature)
    socket.on("sendPanicAlert", (data) => {
      console.log("🚨 Panic Alert Received:", data);
      io.emit("receivePanicAlert", data); // Sabhi connected users ko alert
    });

    // 📍 Location Update Event (Existing)
    socket.on("updateLocation", (data) => {
      console.log("📍 Location Received:", data);
      io.emit("newLocation", data);
    });

    socket.on("disconnect", () => {
      console.log("❌ User Disconnected");
    });
  });

  return io;
};

export default initSocket;
