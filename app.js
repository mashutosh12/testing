import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";  // FIXED
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import incidentRoutes from "./routes/incidentRoutes.js";
import initSocket from "./utils/socket.js";
import locationRoutes from "./routes/locationRoutes.js";
import safeRouteRoutes from "./routes/safeRouteRoutes.js";
import sosRoutes from "./routes/sosRoutes.js";
import initWebSocket from "./utils/websocket.js";

import threatRoutes from "./routes/threatRoutes.js";
dotenv.config();

const app = express();
const server = createServer(app);  // Now it will work

// Middleware
app.use(cors());
app.use(express.json());

// Connect to Database
connectDB();

// Routes
app.use("/api/users", userRoutes);
app.use("/api/incidents", incidentRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/safe-route", safeRouteRoutes);
app.use("/api/sos", sosRoutes);
app.use("/api/threat", threatRoutes);
// Initialize WebSocket
initWebSocket(server);

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));  //`server.listen` instead of `app.listen`
