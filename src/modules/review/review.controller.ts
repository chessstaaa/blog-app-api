import { Request, Response } from "express"
import { ReviewService } from "./review.service"

export class ReviewController {
  service = new ReviewService()

  getReviewsByEvent = async (req: Request, res: Response) => {
    const eventId = Number(req.query.eventId)
    const result = await this.service.getReviewsByEvent({ event_id: eventId })
    return res.status(200).send(result)
  }

  createReview = async (req: Request, res: Response) => {
    const userId = Number(res.locals.user.id)
    const result = await this.service.createReview(req.body, userId)
    return res.status(201).send(result)
  }
}
