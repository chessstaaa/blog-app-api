import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validateBody } from "../../middlewares/validation.middleware";
import { ForgotPasswordDTO } from "./dto/forgot-password.dto";
import { JwtMiddleware } from "../../middlewares/jwt.middleware";
import { ResetPasswordDTO } from "./dto/reset-password.dto";

const jwt = new JwtMiddleware()

export class AuthRouter {
  router: Router;
  authController: AuthController;
  jwtMiddleware: JwtMiddleware;

  constructor() {
    this.router = Router();
    this.authController = new AuthController();
    this.jwtMiddleware = new JwtMiddleware();
    this.initRoutes();
  }

  private initRoutes = () => {
    this.router.post("/register", this.authController.registerController);
    this.router.post("/login", this.authController.loginController);
    this.router.post(
      "/forgot-password",
      validateBody(ForgotPasswordDTO),
      this.authController.forgotPassword
    );
    this.router.post(
      "/reset-password",
      this.jwtMiddleware.verifyToken(process.env.JWT_SECRET_RESET!),
      validateBody(ResetPasswordDTO),
      this.authController.resetPassword
    );
    this.router.get("/me", jwt.verifyToken(process.env.JWT_SECRET!), this.authController.me)
    this.router.patch("/me", jwt.verifyToken(process.env.JWT_SECRET!), this.authController.updateMe)
    
  };

  getRouter = () => {
    return this.router;
  };
}
