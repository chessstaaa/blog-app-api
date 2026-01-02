import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { GetEventsQuery } from "../../types/event";

export class AuthController {
  authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  registerController = async (req: Request, res: Response) => {
    const result = await this.authService.registerService(req.body);
    return res.status(200).send(result);
  };

  loginController = async (req: Request, res: Response) => {
    const result = await this.authService.loginService(req.body);
    return res.status(200).send(result);
  };

  forgotPassword = async (req: Request, res: Response) => {
    const result = await this.authService.forgotPassword(req.body);
    return res.status(200).send(result);
  };

  resetPassword = async (req: Request, res: Response) => {
    const authUserId = Number(res.locals.user.id);
    const result = await this.authService.resetPassword(req.body, authUserId);
    return res.status(200).send(result);
  };
  
  //Additional
  me = async (_: Request, res: Response) => {
    const userId = Number(res.locals.user.id)
    const user = await this.authService.getProfile(userId)
    res.send(user)
  }

  updateMe = async (req: Request, res: Response) => {
    const userId = Number(res.locals.user.id)
    const user = await this.authService.updateProfile(userId, req.body)
    res.send(user)
  }

}
