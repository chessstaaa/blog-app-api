import { Request, Response } from "express"
import { UserService } from "./user.service"

export class UserController {
  service = new UserService()

  register = async (req: Request, res: Response) => {
    const result = await this.service.create(req.body)
    res.status(201).send(result)
  }

  me = async (_: Request, res: Response) => {
    const userId = Number(res.locals.user.id)
    const result = await this.service.me(userId)
    res.send(result)
  }

  updateMe = async (req: Request, res: Response) => {
    const userId = Number(res.locals.user.id)
    const result = await this.service.updateMe(userId, req.body)
    res.send(result)
  }

  public = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const result = await this.service.public(id)
    res.send(result)
  }
}
