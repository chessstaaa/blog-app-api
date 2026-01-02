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
}
