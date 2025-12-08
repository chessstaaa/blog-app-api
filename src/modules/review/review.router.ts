import { Router } from "express";
import { ReviewController } from "./review.controller";

export class ReviewRouter {
  router: Router;
  reviewController: ReviewController;

  constructor() {
    this.router = Router();
    this.reviewController = new ReviewController();
    this.initRoutes();
  }

  private initRoutes = () => {
    this.router.get("/", this.reviewController.getReviewsByEvent);
    this.router.post("/", this.reviewController.createReview);
  };

  getRouter = () => {
    return this.router;
  };
}
