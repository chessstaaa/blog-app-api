import { Request, Response } from "express";
import { UserService } from "./user.service";
import { GetVoucherQuery } from "../../types/voucher";

export class UserController {
  userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  getUser = async (req: Request, res: Response) => {
    const result = await this.userService.getUser(res.locals.user.id);
    return res.status(200).send(result);
  };

  updatePassword = async (req: Request, res: Response) => {
    const result = await this.userService.updatePassword(
      req.body,
      res.locals.user.id
    );
    return res.status(200).send(result);
  };

  updateProfile = async (req: Request, res: Response) => {
    const result = await this.userService.updateProfile(
      req.body,
      res.locals.user.id
    );
    return res.status(200).send(result);
  };
}
