import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/authController.js";
import { getCurrentUser } from "../controllers/meController.js";
import express from "express";

export const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.get("/me", getCurrentUser);
authRouter.get("/logout", logoutUser);
