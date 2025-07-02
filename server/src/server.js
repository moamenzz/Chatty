import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();
import { authRouter } from "./routes/authRouter.js";
import { connectMONGO } from "./lib/dbConn.js";
import { messagesRouter } from "./routes/messagesRouter.js";
import { corsConfig } from "./lib/corsConfig.js";
import cors from "cors";
import { app, server } from "./lib/socket.js";

// const app = express(); This was here before socket.io

const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsConfig));

app.use("/auth", authRouter);
app.use("/messages", messagesRouter);

server.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
  connectMONGO();
}); //This was app.listen
