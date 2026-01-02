<<<<<<< HEAD
import { Router } from "express";
import { UserController } from "./user.controller";
import { JwtMiddleware } from "../../middlewares/jwt.middleware";

export class UserRouter {
  router: Router;
  userController: UserController;
  jwtMiddleware: JwtMiddleware;

  constructor() {
    this.router = Router();
    this.userController = new UserController();
    this.jwtMiddleware = new JwtMiddleware();
    this.initRoutes();
  }

  private initRoutes = () => {
    this.router.get(
      "/",
      this.jwtMiddleware.verifyToken(process.env.JWT_SECRET!),
      this.userController.getUser
    );
    this.router.post(
      "/update-password",
      this.jwtMiddleware.verifyToken(process.env.JWT_SECRET!),
      this.userController.updatePassword
    );
    this.router.post(
      "/update-profile",
      this.jwtMiddleware.verifyToken(process.env.JWT_SECRET!),
      this.userController.updateProfile
    );
  };

  getRouter = () => {
    return this.router;
  };
=======
import { Router } from "express"
import { JwtMiddleware } from "../../middlewares/jwt.middleware"
import { UserController } from "./user.controller"

export class UserRouter {
  router = Router()
  jwt = new JwtMiddleware()
  controller = new UserController()

  constructor() {
    this.router.get(
      "/me",
      this.jwt.verifyToken(process.env.JWT_SECRET!),
      this.controller.me
    )

    this.router.get("/:id", this.controller.public)
  }

  getRouter() {
    return this.router
  }
>>>>>>> git-chesta
}
