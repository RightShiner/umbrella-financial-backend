import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { ensureAuthentication } from "../middlewares/auth.middleware";
import { UserClient } from "../controllers/User";

export const UserRouter = Router()

const Controller = new UserController()

UserRouter.get("/@me", ensureAuthentication, Controller.GetMe)
UserRouter.get("/:id", ensureAuthentication, Controller.GetOne)
// UserRouter.post("/user", (req, res) => UserClient.handlePostRequest({ request: req, response: res }));
// UserRouter.get("/user/:id", (req, res) => UserClient.handleGetRequest({ request: req, response: res }));