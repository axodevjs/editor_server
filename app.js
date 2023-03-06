import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import corsMiddleware from "./middleware/cors.middleware.js";
import documentRoutes from "./routes/documentRoutes.js";
import { Server } from "socket.io";
import { initSockets } from "./sockets/index.js";
import commitRoutes from "./routes/commitRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 6400;
const DB_URL = process.env.DB_URL;

const app = express();

app.use(corsMiddleware);
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/document", documentRoutes);
app.use("/api/commit", commitRoutes);

async function startApp() {
  try {
    await mongoose.connect(DB_URL, { useUnifiedTopology: true });
    const server = app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });

    // Socket setup
    const io = await new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    initSockets(io);
  } catch (e) {
    console.log(e);
  }
}

startApp();
