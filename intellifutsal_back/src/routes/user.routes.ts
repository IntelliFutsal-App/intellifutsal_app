import express from "express";
import { UserController } from "../controllers/user.controller";
import { authMiddleware, coachApprovedMiddleware, roleMiddleware } from "../middlewares";


export const userRouter = express.Router();
const userController = new UserController();

userRouter.get("/", [authMiddleware, roleMiddleware(["ADMIN"])], userController.findAll);
userRouter.get("/inactive", [authMiddleware, roleMiddleware(["ADMIN"])], userController.findAllIncludingInactive);
userRouter.get("/:id", [authMiddleware, roleMiddleware(["ADMIN", "COACH", "PLAYER"]), coachApprovedMiddleware], userController.findById);
userRouter.get("/inactive/:id", [authMiddleware, roleMiddleware(["ADMIN", "COACH", "PLAYER"]), coachApprovedMiddleware], userController.findByIdIncludingInactive);
userRouter.get("/email/:email", [authMiddleware, roleMiddleware(["ADMIN"])], userController.findByEmail);
userRouter.get("/role/:id", [authMiddleware, roleMiddleware(["ADMIN", "COACH", "PLAYER"]), coachApprovedMiddleware], userController.findRoleEntityById);
userRouter.post("/", [authMiddleware, roleMiddleware(["ADMIN"])], userController.save);
userRouter.patch("/", [authMiddleware, roleMiddleware(["ADMIN", "COACH", "PLAYER"]), coachApprovedMiddleware], userController.update);
userRouter.delete("/:id", [authMiddleware, roleMiddleware(["ADMIN"])], userController.delete);
userRouter.patch("/status/:id", [authMiddleware, roleMiddleware(["ADMIN", "COACH", "PLAYER"]), coachApprovedMiddleware], userController.updateStatus);
userRouter.patch("/approve-coach", [authMiddleware, roleMiddleware(["ADMIN"])], userController.approveCoach);