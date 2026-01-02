import { Router } from "express";
import { AuthController } from "./auth.controller";
import { JwtMiddleware } from "../../middlewares/jwt.middleware";

const jwt = new JwtMiddleware()

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
    this.router.get("/me", jwt.verifyToken(process.env.JWT_SECRET!), this.authController.me)
    this.router.patch("/me", jwt.verifyToken(process.env.JWT_SECRET!), this.authController.updateMe)
    
  };

  getRouter = () => {
    return this.router;
  };
}
