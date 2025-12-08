import { Prisma } from "@prisma/client";
import { ApiError } from "../../utils/api-error";
import { PrismaService } from "../prisma/prisma.service";
import { GetReviewsQuery } from "../../types/review";
import { CreateReviewDTO } from "./dto/create-review-dto";

export class ReviewService {
  prisma: PrismaService;

  constructor() {
    this.prisma = new PrismaService();
  }

  getReviewsByEvent = async (query: GetReviewsQuery) => {
    const { event_id } = query;

    const whereClause: Prisma.ReviewWhereInput = {
      eventId: {
        equals: event_id,
      },
    };

    const reviews = await this.prisma.review.findMany({
      where: whereClause,
    });
    return reviews;
  };

  createReview = async (body: CreateReviewDTO, userId: number) => {
    await this.prisma.review.create({
      data: { ...body, userId },
    });

    return { message: "Create review success" };
  };
}
