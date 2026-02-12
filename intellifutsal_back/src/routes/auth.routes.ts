import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";


export const authRouter = Router();
const authController = new AuthController();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.get("/validate-token", authController.validateToken);
authRouter.post("/refresh-token", authController.refreshToken);
authRouter.post("/logout", authController.logout);