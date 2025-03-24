import { WebSocketServer } from "ws";

const initWebSocket = (server) => {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    console.log("Client connected");

    ws.on("message", (message) => {
      console.log(`Received: ${message}`);

      if (message.toString().toLowerCase() === "help me") {
        console.log("SOS Alert Triggered!");
        ws.send("SOS Alert Sent!");
      }
    });

    ws.on("close", () => console.log("Client disconnected"));
  });

  console.log("WebSocket server initialized");
};

export default initWebSocket;
