import express from "express";
import { UserController } from "../controllers/user.controller";
import { authMiddleware, roleMiddleware } from "../middlewares";


export const userRouter = express.Router();
const userController = new UserController();

userRouter.get("/", [authMiddleware, roleMiddleware(["ADMIN", "COACH"])], userController.findAll);
userRouter.get("/inactive", [authMiddleware, roleMiddleware(["ADMIN", "COACH", "PLAYER"])], userController.findAllIncludingInactive);
userRouter.get("/:id", [authMiddleware, roleMiddleware(["ADMIN", "COACH", "PLAYER"])], userController.findById);
userRouter.get("/inactive/:id", [authMiddleware, roleMiddleware(["ADMIN", "COACH", "PLAYER"])], userController.findByIdIncludingInactive);
userRouter.get("/email/:email", [authMiddleware, roleMiddleware(["ADMIN", "COACH", "PLAYER"])], userController.findByEmail);
userRouter.get("/role/:id", [authMiddleware, roleMiddleware(["ADMIN", "COACH", "PLAYER"])], userController.findRoleEntityById);
userRouter.post("/", [authMiddleware, roleMiddleware(["ADMIN", "COACH"])], userController.save);
userRouter.patch("/", [authMiddleware, roleMiddleware(["ADMIN", "COACH", "PLAYER"])], userController.update);
userRouter.delete("/:id", [authMiddleware, roleMiddleware(["ADMIN"])], userController.delete);
userRouter.patch("/status/:id", [authMiddleware, roleMiddleware(["ADMIN", "COACH", "PLAYER"])], userController.updateStatus);