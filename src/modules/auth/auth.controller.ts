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
}
