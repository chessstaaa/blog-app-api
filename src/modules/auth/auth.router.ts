import { Router } from "express";
import { AuthController } from "./auth.controller";

export class AuthRouter {
  router: Router;
  authController: AuthController;

  constructor() {
    this.router = Router();
    this.authController = new AuthController();
    this.initRoutes();
  }

  private initRoutes = () => {
    this.router.get("/register", this.authController.registerController);
    this.router.get("/login", this.authController.loginController);
  };

  getRouter = () => {
    return this.router;
  };
}
