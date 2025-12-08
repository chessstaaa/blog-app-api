import { Prisma } from "@prisma/client";
import { GetEventsQuery } from "../../types/event";
import { ApiError } from "../../utils/api-error";
import { PrismaService } from "../prisma/prisma.service";

export class EventService {
  prisma: PrismaService;

  constructor() {
    this.prisma = new PrismaService();
  }

  getEvents = async (query: GetEventsQuery) => {
    const { page, take, search } = query;

    const whereClause: Prisma.EventWhereInput = {};

    if (search) whereClause.title = { contains: search, mode: "insensitive" };

    const events = await this.prisma.event.findMany({
      where: whereClause,
      take,
      skip: (page - 1) * take,
    });
    return events;
  };

  getEventByTitle = async (title: string) => {
    const event = await this.prisma.event.findFirst({
      where: { title },
    });

    if (!event) throw new ApiError("Event not found", 404);

    return event;
  };
}
