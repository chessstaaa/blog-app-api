import { Prisma } from "@prisma/client"
import { ApiError } from "../../utils/api-error"
import { PrismaService } from "../prisma/prisma.service"
import { GetReviewsQuery } from "../../types/review"
import { CreateReviewDTO } from "./dto/create-review-dto"

export class ReviewService {
  prisma = new PrismaService()

  getReviewsByEvent = async (query: GetReviewsQuery) => {
    return this.prisma.review.findMany({
      where: { eventId: query.event_id },
      include: { user: { select: { id: true, name: true } } }
    })
  }

  createReview = async (body: CreateReviewDTO, userId: number) => {
    const paid = await this.prisma.transaction.findFirst({
      where: {
        userId,
        eventId: body.eventId,
        status: "PAID"
      }
    })

    if (!paid) throw new ApiError("You must attend event first", 403)

    const exist = await this.prisma.review.findFirst({
      where: { userId, eventId: body.eventId }
    })

    if (exist) throw new ApiError("You already reviewed this event", 400)

    await this.prisma.review.create({
      data: {
        userId,
        eventId: body.eventId,
        rating: body.rating,
        comment: body.comment
      }
    })

    return { message: "Create review success" }
  }
}
