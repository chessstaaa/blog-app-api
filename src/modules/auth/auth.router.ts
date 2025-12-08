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
    this.router.post("/register", this.authController.registerController);
    this.router.post("/login", this.authController.loginController);
  };

  getRouter = () => {
    return this.router;
  };
}
