import { Request, Response } from "express";
import { ReviewService } from "./review.service";
import { GetEventsQuery } from "../../types/event";
import { GetReviewsQuery } from "../../types/review";

export class ReviewController {
  reviewService: ReviewService;

  constructor() {
    this.reviewService = new ReviewService();
  }

  getReviewsByEvent = async (req: Request, res: Response) => {
    const query: GetReviewsQuery = {
      event_id: parseInt(req.query.eventId as string),
    };
    const result = await this.reviewService.getReviewsByEvent(query);
    return res.status(200).send(result);
  };

  createReview = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const result = await this.reviewService.createReview(
      req.body,
      res.locals.user.userId
    );
    return res.status(200).send(result);
  };
}
