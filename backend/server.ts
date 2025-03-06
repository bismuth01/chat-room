import express from "express";
import cors from "cors";
import http from "http";
import { join } from "path";
import { Server, Socket } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST"],
  },
});

const users: Record<string, string> = {};

io.on("connection", (socket) => {
  console.log(`${socket.id}`);
  socket.on("message", (arg, callback) => {
    socket.broadcast.emit("add_message", arg);
    socket.emit("add_message", arg);
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
