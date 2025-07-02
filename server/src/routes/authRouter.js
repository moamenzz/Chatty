import express from "express";
import {
  handleLogin,
  handleLogout,
  handleRefresh,
  handleRegister,
  handleUpdateProfile,
} from "../controllers/authController.js";
import { verifyJWT } from "../middleware/verifyJWT.js";

export const authRouter = express.Router();

authRouter.post("/register", handleRegister);

authRouter.post("/login", handleLogin);

authRouter.get("/logout", handleLogout);
authRouter.get("/refresh", handleRefresh);

authRouter.put("/update-profile", verifyJWT, handleUpdateProfile);
