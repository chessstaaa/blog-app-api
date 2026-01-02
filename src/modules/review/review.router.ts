import { Router } from "express"
import { ReviewController } from "./review.controller"
import { JwtMiddleware } from "../../middlewares/jwt.middleware"
import { validateBody } from "../../middlewares/validation.middleware"
import { CreateReviewDTO } from "./dto/create-review-dto"

export class ReviewRouter {
  router = Router()
  controller = new ReviewController()
  jwt = new JwtMiddleware()

  constructor() {
    this.initRoutes()
  }

  private initRoutes = () => {
    this.router.get("/", this.controller.getReviewsByEvent)

    this.router.post(
      "/",
      this.jwt.verifyToken(process.env.JWT_SECRET!),
      validateBody(CreateReviewDTO),
      this.controller.createReview
    )
  }

  getRouter() {
    return this.router
  }
}
