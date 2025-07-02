import express from "express";
import { verifyJWT } from "../middleware/verifyJWT.js";
import {
  handleGetMessages,
  handleGetContacts,
  handleSendMessages,
} from "../controllers/messagesController.js";

export const messagesRouter = express.Router();

messagesRouter.get("/users", verifyJWT, handleGetContacts);
messagesRouter.get("/:id", verifyJWT, handleGetMessages);
messagesRouter.post("/send/:id", verifyJWT, handleSendMessages);
