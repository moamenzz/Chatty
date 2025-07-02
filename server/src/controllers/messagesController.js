import express from "express";
import User from "../models/user.models.js";
import Message from "../models/message.models.js";
import cloudinary from "../lib/Cloudinary.js";
import { getSocketReceiverId, io } from "../lib/socket.js";

export const handleGetContacts = async (req, res) => {
  try {
    const loggedInUser = req.Id;
    const contacts = await User.find({ _id: { $ne: loggedInUser } }).select(
      "-password -refreshToken -roles"
    );

    res.status(200).json(contacts);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const handleGetMessages = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const senderId = req.Id;

    const messages = await Message.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    });

    res.status(200).json(messages);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const handleSendMessages = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.Id;

    if (!text || text.length > 255)
      return res.status(400).json({ error: "Text is too long or empty" });

    let imageUrl;
    try {
      if (image) {
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
      }
    } catch (e) {
      console.error(e);
      return res.status(401).json({ error: "Failed to upload image" });
    }

    const message = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await message.save();

    const socketReceiverId = getSocketReceiverId(receiverId);
    if (socketReceiverId) io.to(socketReceiverId).emit("message", message);

    res.status(200).json(message);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
